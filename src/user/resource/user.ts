import { Exclude } from 'class-transformer';

export class UserResource {
  id: string;
  email: string;
  @Exclude()
  password: string;
  @Exclude()
  salt: string;
}
