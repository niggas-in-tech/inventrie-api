import { ApiProperty } from '@nestjs/swagger';

export class LoginResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  token: string;
}
