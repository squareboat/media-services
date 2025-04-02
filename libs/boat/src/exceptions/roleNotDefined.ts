import { HttpException } from '@nestjs/common';

export class RoleNotDefinedException extends HttpException {
  constructor() {
    super('Role not defined', 403);
  }
}
