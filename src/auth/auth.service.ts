import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { randomInt } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmailWithPassword(
      loginDto.email,
    );

    if (!user) {
      throw new UnauthorizedException(
        'Email ou mot de passe incorrect',
      );
    }

    const isPasswordValid =
      await bcrypt.compare(
        loginDto.password,
        user.password,
      );

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Email ou mot de passe incorrect',
      );
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token:
        await this.jwtService.signAsync(payload),

      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmailWithPassword(email);

    if (!user) {
      throw new NotFoundException(
        'Utilisateur introuvable',
      );
    }

    const code = String(randomInt(100000, 999999));
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await this.usersService.saveResetPasswordCode(user.id, code, expiresAt);

    const result = await this.mailService.sendResetPasswordCode(
      email,
      user.fullName,
      code,
    );

    if (!result.success) {
      throw new Error('Échec de l\'envoi de l\'email de réinitialisation');
    }

    return {
      message:
        'Code de réinitialisation envoyé',
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException(
        'Les mots de passe ne correspondent pas',
      );
    }

    const user = await this.usersService.findByEmailWithPassword(dto.email);

    if (!user) {
      throw new NotFoundException(
        'Utilisateur introuvable',
      );
    }

    if (
      !user.resetPasswordCode ||
      !user.resetPasswordCodeExpiresAt ||
      new Date() > user.resetPasswordCodeExpiresAt
    ) {
      throw new UnauthorizedException(
        'Code expiré ou invalide',
      );
    }

    const isCodeValid = await bcrypt.compare(
      dto.code,
      user.resetPasswordCode,
    );

    if (!isCodeValid) {
      throw new UnauthorizedException(
        'Code invalide',
      );
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    await this.usersService.updatePassword(user.id, hashedPassword);
    await this.usersService.clearResetPasswordCode(user.id);

    return {
      message:
        'Mot de passe modifié avec succès',
    };
  }
}