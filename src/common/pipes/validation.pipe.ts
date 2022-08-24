import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  UnprocessableEntityException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
// import { AnyZodObject, ZodError } from 'zod';

class RequestValidationError extends Error {
  statusCode: number;
  message: string;
  errors: { path: string; message: string }[];
  code: string;
  constructor(errors) {
    super();
    this.statusCode = 422;
    this.message = 'Validation failed';
    this.errors = errors;
    this.code = 'VALIDATION_FAILED';
  }
}

@Injectable()
export class RequestValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      throw new RequestValidationError(this.formatErrors(errors));
    }
    return value;
  }

  formatErrors(errors: ValidationError[]) {
    return errors.map((e) => ({
      field: e.property,
      message: Object.values(e.constraints)[0],
    }));
  }
}
