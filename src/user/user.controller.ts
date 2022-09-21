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
import {
  ApiCreatedResponse,
  ApiHeader,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ValidationErrorSchema } from 'src/common.openapi';

@ApiTags('users')
@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'User created.',
    type: UserResource,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid payload',
    type: ValidationErrorSchema,
  })
  async create(
    @Body(new RequestValidationPipe()) createUserDto: CreateUserDto,
  ): Promise<UserResource> {
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

  @ApiHeader({ name: 'Authorization' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return plainToInstance(UserResource, user);
  }
}
