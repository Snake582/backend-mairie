import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailerService: MailerService,
    private configService: ConfigService,
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
    };

    return {
      access_token:
        await this.jwtService.signAsync(payload),

      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
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

    const token = this.jwtService.sign(
      {
        id: user.id,
      },
      {
        secret: this.configService.get<string>('JWT_RESET_SECRET'),
        expiresIn: '15m',
      },
    );

    const resetLink =
      `${this.configService.get<string>('FRONTEND_URL')}` +
      `/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject:
        'Réinitialisation du mot de passe',
      html: `
        <h2>Sunu Mairie</h2>

        <p>
        Cliquez sur le bouton ci-dessous
        pour réinitialiser votre mot de passe.
        </p>

        <a href="${resetLink}">
          Réinitialiser mon mot de passe
        </a>
      `,
    });

    return {
      message:
        'Email de réinitialisation envoyé',
    };
  }

  async resetPassword(token: string, password: string) {
    const payload = this.jwtService.verify(token, {
      secret: this.configService.get<string>('JWT_RESET_SECRET'),
    });

    const user = await this.usersService.findOne(payload.id);

    if (!user) {
      throw new NotFoundException(
        'Utilisateur introuvable',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.usersService.updatePassword(user.id, hashedPassword);

    return {
      message:
        'Mot de passe modifié avec succès',
    };
  }
}