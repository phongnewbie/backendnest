import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Internal server error' };

    const getMessage = (resp: string | object): string | string[] => {
      if (typeof resp === 'string') return resp;
      if (typeof resp === 'object' && resp !== null && 'message' in resp) {
        return (resp as { message: string | string[] }).message;
      }
      return 'Internal server error';
    };

    const message = getMessage(exceptionResponse);

    response.status(status).json({
      statusCode: status,
      message: Array.isArray(message) ? message[0] : message,
      data: null,
    });
  }
}
