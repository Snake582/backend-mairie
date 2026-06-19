import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailConfig } from '../config/email.config';
import { MailService } from './mail.service';

@Module({
  imports: [ConfigModule.forFeature(EmailConfig)],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
