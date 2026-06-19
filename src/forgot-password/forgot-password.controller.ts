import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';

import { ForgotPasswordService } from './forgot-password.service';

import { ForgotPasswordDto } from './dto/create-forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('forgot-password')
export class ForgotPasswordController {
  constructor(
    private readonly forgotPasswordService: ForgotPasswordService,
  ) {}

  @Post()
  forgotPassword(
    @Body()
    forgotPasswordDto: ForgotPasswordDto,
  ) {
    return this.forgotPasswordService.forgotPassword(
      forgotPasswordDto.email,
    );
  }

  @Post('reset')
  resetPassword(
    @Body()
    resetPasswordDto: ResetPasswordDto,
  ) {
    return this.forgotPasswordService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.password,
    );
  }
}