import { IsEmail, Length } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @Length(8, 50)
  password: string;
}
