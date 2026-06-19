import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly resend: Resend;

  constructor(private readonly configService: ConfigService) {
    this.resend = new Resend(this.configService.get<string>('email.resend_api_key'));
  }

  async sendResetPasswordCode(email: string, name: string, code: string) {
    try {
      const result = await this.resend.emails.send({
        from: this.configService.get<string>('email.resend_mail_from') ?? '',
        to: email,
        subject: 'Réinitialisation de votre mot de passe',
        html: `
          <h2>Sunu Mairie</h2>
          <p>Bonjour ${name},</p>
          <p>Voici votre code de réinitialisation de mot de passe :</p>
          <h1 style="letter-spacing: 8px; font-size: 32px;">${code}</h1>
          <p>Ce code expire dans 15 minutes.</p>
          <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
        `,
      });

      if (result.error) {
        this.logger.error(`Failed to send reset password code to ${email}: ${result.error.message}`);
        return { success: false, error: result.error };
      }

      this.logger.log(`Reset password code sent to ${email} (resend id: ${result.data?.id})`);
      return { success: true, data: result.data };
    } catch (err) {
      this.logger.error(`Unexpected error sending reset password code to ${email}: ${JSON.stringify(err)}`);
      return { success: false, error: err };
    }
  }
}
