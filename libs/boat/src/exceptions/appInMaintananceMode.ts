import { HttpException } from '@nestjs/common';

export class AppInMaintananceModeException extends HttpException {
  constructor() {
    super('Server is currently down for maintainance', 503);
  }
}
