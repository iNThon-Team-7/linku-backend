import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Logger } from '@nestjs/common';
import { getClientIp } from '../utils/ip.util';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('API Call');

  use(request: Request, response: Response, next: NextFunction): void {
    const ip = getClientIp(request);

    const startAt = process.hrtime();
    const { method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('close', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length') || 0;
      const diff = process.hrtime(startAt);
      const responseTime = Math.round(diff[0] * 1e6 + diff[1] * 1e-3) / 1e3;

      this.logger.log(
        `${method} ${originalUrl} [${statusCode}, ${responseTime}ms, ${contentLength}byte] - ${ip} ${userAgent}`,
      );
    });

    next();
  }
}
