import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TokenPayloadDto } from 'src/dtos';

export const AuthUser = createParamDecorator(
  (data: any, ctx: ExecutionContext): TokenPayloadDto => {
    const request = ctx.switchToHttp().getRequest();
    return request?.user;
  },
);
