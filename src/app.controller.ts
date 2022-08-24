import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { RequestValidationPipe } from './common/pipes/validation.pipe';
import { IsEmail } from 'class-validator';

class ddto {
  @IsEmail()
  email: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  getHello(@Body(new RequestValidationPipe()) bd: ddto): string {
    return this.appService.getHello();
  }
}
