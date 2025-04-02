import {
  ExecutionContext,
  SetMetadata,
  UseGuards,
  applyDecorators,
  createParamDecorator,
} from '@nestjs/common';
import { BaseValidator } from './basevalidator';
import { CustomValidationPipe } from './validationPipe';

export * from './decorators';
export { BaseValidator };

export function Validate(DTO: any) {
  return applyDecorators(
    // ApiBody({ type: DTO }),
    SetMetadata('dtoSchema', DTO),
    UseGuards(CustomValidationPipe),
  );
}

export const Dto = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const contextType = ctx['contextType'];
    if (contextType === 'ws') {
      return ctx.switchToWs().getClient()._dto;
    }
    const request = ctx.switchToHttp().getRequest();
    return request._dto;
  },
);
