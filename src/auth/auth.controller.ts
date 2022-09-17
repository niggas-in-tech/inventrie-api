import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { RequestValidationPipe } from 'src/common/pipes/validation.pipe';
import { PrismaService } from 'src/prisma/prisma.service';
import { comparePassword, generateJwt } from 'src/utils/helpers/auth.helpers';
import { LoginDto } from './dto/login.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private prisma: PrismaService) {}

  @Post('login')
  async login(@Body(new RequestValidationPipe()) loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.prisma.user.findUnique({ where: { email } });
    const err = new BadRequestException('Invalid credentials');
    if (!user) {
      throw err;
    }
    const match = await comparePassword(password, user.salt, user.password);
    if (!match) {
      throw err;
    }
    const token = generateJwt({
      sub: user.id,
      name: `${user.firstName} ${user.lastName}`,
    });
    return { token, id: user.id };
  }

  @Get('me')
  async CurrentUser() {
    return 'Hello';
  }
}
