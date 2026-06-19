import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  userRepository: any;
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(
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
  const user = await this.userRepository.findOne({
    where: { email },
  });

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
      secret: process.env.JWT_SECRET,
      expiresIn: '15m',
    },
  );

  const resetLink =
    `${process.env.FRONTEND_URL}` +
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
}