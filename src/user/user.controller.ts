import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RequestValidationPipe } from 'src/common/pipes/validation.pipe';
import { hashPassword } from 'src/utils/helpers/auth.helpers';
import { plainToInstance } from 'class-transformer';
import { UserResource } from './resource/user';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(
    @Body(new RequestValidationPipe()) createUserDto: CreateUserDto,
  ) {
    const { password } = createUserDto;
    const { hash, salt } = await hashPassword(password);
    const userData = { ...createUserDto, password: hash, salt };
    const user = await this.userService.create(userData);
    return plainToInstance(UserResource, user);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return plainToInstance(UserResource, user);
  }
}
