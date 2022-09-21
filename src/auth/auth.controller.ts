import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RequestValidationPipe } from 'src/common/pipes/validation.pipe';
import { PrismaService } from 'src/prisma/prisma.service';
import { comparePassword, generateJwt } from 'src/utils/helpers/auth.helpers';
import { LoginDto } from './dto/login.dto';
import { LoginResponse } from './resource/openapi';

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(private prisma: PrismaService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOkResponse({
    description: 'Logged in',
    type: LoginResponse,
  })
  async login(
    @Body(new RequestValidationPipe()) loginDto: LoginDto,
  ): Promise<LoginResponse> {
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
