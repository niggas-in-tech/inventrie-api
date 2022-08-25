import { Exclude } from 'class-transformer';

export class UserResource {
  @Exclude()
  password: string;
  @Exclude()
  salt: string;
}
