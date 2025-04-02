import { ArgumentsHost, ExecutionContext } from '@nestjs/common';
import { Request } from '../rest';

export class Context {
  req: Request;

  setRequest(req: Request): this {
    this.req = req;
    return this;
  }

  getRequest(): Request {
    return this.req;
  }
}

export const getPayloadFromHost = (ctx: ArgumentsHost | ExecutionContext) => {
  const contextType = ctx['contextType'];
  if (contextType == 'ws') {
    return ctx.switchToWs().getData();
  } else if (contextType == 'http') {
    const request = ctx.switchToHttp().getRequest();
    return request.all();
  }

  throw new Error('No context found');
};

export const getReqClientFromHost = (ctx: ArgumentsHost | ExecutionContext) => {
  const contextType = ctx['contextType'];
  if (contextType == 'ws') {
    return ctx.switchToWs().getClient();
  } else if (contextType == 'http') {
    return ctx.switchToHttp().getRequest();
  }

  throw new Error('No context found');
};
