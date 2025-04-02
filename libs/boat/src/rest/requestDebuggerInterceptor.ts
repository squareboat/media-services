import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: FastifyRequest, response: FastifyReply, next: any): void {
    const { ip, method, url } = request;
    const userAgent = request.headers['user-agent'] || '';

    next();
  }
}
