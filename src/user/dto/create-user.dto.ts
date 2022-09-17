import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateUserDto {
  @Length(2, 20)
  firstName: string;

  @Length(2, 20)
  lastName: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  phone: string;

  @Length(8, 50)
  password: string;
}
