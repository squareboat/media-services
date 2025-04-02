import { HttpException } from '@nestjs/common';

export class AuthException extends HttpException {
  constructor(errCode: string) {
    super(errCode, 403);
  }
}
