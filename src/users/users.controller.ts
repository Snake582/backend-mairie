import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Req,
  Patch,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  register(
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.usersService.create(
      createUserDto,
    );
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async profile(@Req() req) {
    return this.usersService.findOne(req.user.userId);
  }

  @Post('upload')
@UseInterceptors(
  FileInterceptor('photo', {
    storage: diskStorage({
      destination: './uploads',

      filename: (req, file, callback) => {
        const uniqueName =
          Date.now() +
          '-' +
          Math.round(Math.random() * 1e9) +
          extname(file.originalname);

        callback(null, uniqueName);
      },
    }),
  }),
)
uploadFile(
  @UploadedFile() file: Express.Multer.File,
) {
  return {
    imageUrl: `http://192.168.1.9:3000/uploads/${file.filename}`,
  };
}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
updateUser(
  @Param('id') id: string,
  @Body() updateUserDto: UpdateUserDto,
) {
  return this.usersService.update(
    +id,
    updateUserDto,
  );
}
}