import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';

import { UsersModule } from '../users/users.module';

import { ForgotPasswordController } from './forgot-password.controller';
import { ForgotPasswordService } from './forgot-password.service';

@Module({
  imports: [
    UsersModule,

    JwtModule.register({}),

    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: Number(
          process.env.MAIL_PORT,
        ),
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      },
    }),
  ],

  controllers: [
    ForgotPasswordController,
  ],

  providers: [ForgotPasswordService],
})
export class ForgotPasswordModule {}