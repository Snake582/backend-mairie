import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';

import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';

@Injectable()
export class ForgotPasswordService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async forgotPassword(email: string) {
    const user =
      await this.usersService.findByEmail(
        email,
      );

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
        Vous avez demandé une réinitialisation
        de votre mot de passe.
        </p>

        <p>
        Cliquez sur le lien ci-dessous :
        </p>

        <a href="${resetLink}">
          Réinitialiser mon mot de passe
        </a>

        <p>
        Ce lien expire dans 15 minutes.
        </p>
      `,
    });

    return {
      message:
        'Email de réinitialisation envoyé',
    };
  }

  async resetPassword(
    token: string,
    password: string,
  ) {
    const payload =
      this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

    const user =
      await this.usersService.findOne(
        payload.id,
      );

    if (!user) {
      throw new NotFoundException(
        'Utilisateur introuvable',
      );
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    await this.usersService.updatePassword(
      user.id,
      hashedPassword,
    );

    return {
      message:
        'Mot de passe modifié avec succès',
    };
  }
}