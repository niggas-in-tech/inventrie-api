import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class UserResource {
  @ApiProperty({ example: '5f9f9c9c9c9c9c9c9c9c9c9c' })
  id: string;

  @ApiProperty({ example: 'ktk@gmail.com' })
  email: string;

  @ApiProperty({ example: 'Lord' })
  firstName: string;

  @ApiProperty({ example: 'Thokk' })
  lastName: string;

  @Exclude()
  password: string;

  @Exclude()
  salt: string;

  @Exclude()
  createdAt: string;

  @Exclude()
  updatedAt: string;
}
