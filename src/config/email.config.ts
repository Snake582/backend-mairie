import { registerAs } from '@nestjs/config';

export interface IEmailConfig {
  resend_api_key: string;
  resend_mail_domain: string;
  resend_mail_from: string;
}

export const EmailConfig = registerAs(
  'email',
  (): IEmailConfig => ({
    resend_api_key: String(process.env.RESEND_API_KEY ?? ''),
    resend_mail_domain: String(process.env.RESEND_MAIL_DOMAIN ?? ''),
    resend_mail_from: String(process.env.EMAIL_FROM ?? ''),
  }),
);
