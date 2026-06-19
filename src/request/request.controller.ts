import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';

import { RequestService } from './request.service';

import { CreateRequestDto } from './dto/create-request.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('requests')
export class RequestController {
  constructor(
    private readonly requestService: RequestService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() dto: CreateRequestDto,
    @Request() req,
  ) {
    return this.requestService.create(
      dto,
      req.user.userId,
    );
  }

  @Get('my-requests')
  @UseGuards(JwtAuthGuard)
  findMyRequests(@Request() req) {
    return this.requestService.findByUser(
      req.user.userId,
    );
  }
}