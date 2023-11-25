import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ForbiddenException,
  HttpException,
  InternalServerErrorException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request } from 'express';
import { ValidationException } from '../exceptions/validation.exception';
import { EntityNotFoundError, TypeORMError } from 'typeorm';
import { AuthorizationException } from '../exceptions/authorization.expetion';
import { PermissionException } from '../exceptions/permission.exception';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private convertToHttpException(exception: Error): HttpException {
    switch (true) {
      case exception instanceof HttpException:
        return exception as HttpException;
      case exception instanceof ValidationException:
        return new BadRequestException('잘못된 형식의 요청입니다.');
      case exception instanceof EntityNotFoundError:
        return new BadRequestException('요청한 정보가 존재하지 않습니다.');
      case exception instanceof AuthorizationException:
        return new UnauthorizedException('사용자 인증이 필요한 요청입니다.');
      case exception instanceof PermissionException:
        return new ForbiddenException(
          '해당 요청에 대한 충분한 권한이 없습니다.',
        );
      case exception instanceof TypeORMError:
        return new UnprocessableEntityException(
          '요청한 작업을 수행할 수 없습니다.',
        );
      default:
        return new InternalServerErrorException('서버 오류가 발생했습니다.');
    }
  }
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();

    console.log({
      path: `${request.method} ${request.url}`,
      timestamp: new Date().toISOString(),
      errorStack: exception,
    });

    super.catch(this.convertToHttpException(exception), host);
  }
}
