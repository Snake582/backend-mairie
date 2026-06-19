import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';

import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';

import { AuthController } from './auth.controller';

import { UsersModule } from '../users/users.module';

import { JwtStrategy } from './strategies/jwt.strategy';

import { MailerModule } from '@nestjs-modules/mailer'

@Module({
  imports: [
    UsersModule,

    PassportModule,

    JwtModule.register({
      secret: 'SECRET_KEY',

      signOptions: {
        expiresIn: '7d',
      },
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      },
    }),
  ],

  controllers: [AuthController],

  providers: [
    AuthService,
    JwtStrategy,
  ],
})
export class AuthModule {}