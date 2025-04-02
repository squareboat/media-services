import { HttpException } from '@nestjs/common';

export class Unauthorized extends HttpException {
  constructor(msg?: string) {
    super(msg || 'Unauthorized.', 401);
  }
}
