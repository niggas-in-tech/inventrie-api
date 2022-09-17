import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import * as dayjs from 'dayjs';
import { Response, Request } from 'express';
import { PrismaClientKnownRequestError } from 'generated/prisma-client/runtime';
import { logger } from 'src/utils/logger';
import { RequestValidationError } from '../pipes/validation.pipe';

@Catch()
export class AppExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let code = (exception as any)?.code || 'HTTP_EXCEPTION';
    let status =
      (exception as any)?.statusCode ||
      (exception as any)?.status ||
      HttpStatus.INTERNAL_SERVER_ERROR;
    let message =
      (exception as any)?.message ?? 'Something broke on the server';
    let meta = {};
    const errors = (exception as any)?.errors || [];

    logger.error((exception as any).message, request.path);
    console.log(exception);

    if (exception instanceof RequestValidationError) {
      message = 'Resource validation failed';
      status = 422;
      code = 'VALIDATION_FAILED';
    }

    if (exception instanceof NotFoundException) {
      message = 'Route not found';
      status = 404;
      code = 'NOT_FOUND';
    }

    if (exception instanceof PrismaClientKnownRequestError) {
      status = 400;
      switch (exception.code) {
        case 'P2002':
          const field = ((exception.meta?.target + '') as string)
            .split('_')
            .slice(0, 2);
          message = `${field[0]} already exists`;
          code = 'DUPLICATE_UNIQUE_KEY';
          meta = { entity: field[0], field: field[1] };
          break;
        default:
          break;
      }
    }

    return response
      .status(status)
      .json(sendErrorResponse({ code, message, meta, errors }));
  }
}

const sendErrorResponse = ({ message, code, meta, errors }) => ({
  message,
  timestamp: dayjs().format(),
  code,
  meta,
  errors,
});
