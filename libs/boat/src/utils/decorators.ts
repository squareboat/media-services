import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const contextType = ctx['contextType'];
    if (contextType === 'ws') {
      return ctx.switchToWs().getClient().user;
    }
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
