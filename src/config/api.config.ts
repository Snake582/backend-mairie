import { registerAs } from '@nestjs/config';

export interface IApiConfig {
  origins: string[];
}

export const ApiConfig = registerAs(
  'api',
  (): IApiConfig => ({
    origins: (process.env.API_ORIGINS ?? process.env.FRONTEND_URL ?? 'http://localhost:3001')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  }),
);
