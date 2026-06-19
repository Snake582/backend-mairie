import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(
      loginDto.email,
    );

    if (!user) {
      throw new UnauthorizedException(
        'Email ou mot de passe incorrect',
      );
    }

    const isPasswordValid =
      await bcrypt.compare(
        loginDto.password,
        user.password,
      );

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Email ou mot de passe incorrect',
      );
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    return {
      access_token:
        await this.jwtService.signAsync(payload),

      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
      },
    };
  }
}