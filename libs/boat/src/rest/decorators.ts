import {
  ExecutionContext,
  SetMetadata,
  UseGuards,
  applyDecorators,
  createParamDecorator,
} from "@nestjs/common";
import { ROUTE_NAME } from "./constants";
import "reflect-metadata";
import { ResponseSerializer } from "./serializers/responseSerializer";

export function WithAlias(name: string) {
  return function (
    target: Record<string, any>,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    Reflect.defineMetadata(ROUTE_NAME, name, target, propertyKey);
  };
}

export const SecretProtected = (...roles: string[]) =>
  applyDecorators(SetMetadata("roles", roles), UseGuards());

export const Serializer = createParamDecorator(
  (data: string, ctx: ExecutionContext): ResponseSerializer => {
    const contextType = ctx["contextType"];
    if (contextType === "ws") {
      return ctx.switchToWs().getClient()._dto;
    }
    const request = ctx.switchToHttp().getRequest();
    return request._responseSerializer;
  }
);
