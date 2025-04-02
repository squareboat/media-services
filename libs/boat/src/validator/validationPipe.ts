import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BaseValidator } from './basevalidator';
import { getPayloadFromHost, getReqClientFromHost } from '../utils';

@Injectable()
export class CustomValidationPipe implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const payload = getPayloadFromHost(context);
    const reqClient = getReqClientFromHost(context);

    const schema = this.reflector.get('dtoSchema', context.getHandler());
    const validator = new BaseValidator();
    validator.setHost(context);

    // validator.setContext(req);
    reqClient._dto = await validator.fire(payload, schema);

    return true;
  }
}
