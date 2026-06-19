import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  login(
    @Body() loginDto: LoginDto,
  ) {
    return this.authService.login(
      loginDto,
    );
  }

  @Post('forgot-password')
forgotPassword(
  @Body() dto: ForgotPasswordDto,
) {
  return this.authService.forgotPassword(
    dto.email,
  );
}

@Post('reset-password')
resetPassword(
  @Body() dto: ResetPasswordDto,
) {
  return this.authService.resetPassword(
    dto,
  );
}
}