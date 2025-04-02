import {
  Catch,
  ArgumentsHost,
  NotFoundException,
  UnauthorizedException,
  HttpException,
} from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { ValidationFailed, InvalidCredentials, GenericException } from ".";
import { Unauthorized } from "./unauthorized";
import { FastifyReply, FastifyRequest } from "fastify";
import { RestApiHeaders } from "../rest";

@Catch(HttpException)
export class ExceptionFilter extends BaseExceptionFilter {
  doNotReport(): Array<any> {
    return [
      NotFoundException,
      ValidationFailed,
      InvalidCredentials,
      GenericException,
      Unauthorized,
      UnauthorizedException,
    ];
  }

  catch(exception: any, host: ArgumentsHost) {
    console.error("exception ===> ", exception);
    const contextType = host["contextType"];

    const exceptionConstructor = exception?.constructor;

    if (
      exceptionConstructor &&
      !this.doNotReport().includes(exceptionConstructor)
    ) {
      console.log("reporting 🔎 ===> ");
    }

    if (contextType == "ws") {
      return this.handleWsException(exception, host);
    }

    return this.handleHttpException(exception, host);
  }

  handleWsException(exception: any, host: ArgumentsHost) {
    console.error("error ====> ", exception);
    const ctx = host.switchToWs();
    const data = ctx.getData();
    const client = ctx.getClient();

    // if (exception instanceof WsValidationFailed) {
    //   client.emit('exception', {
    //     success: false,
    //     code: '422',
    //     errors: exception.getErrors(),
    //     $event: { name: client.event, payload: data },
    //   });
    //   return;
    // }

    let message =
      exception.message || "Something went wrong. Please try again later";

    const status = exception.status ? exception.code : 500;
    message = exception.status ? message : "Internal Server Error";

    client.emit("exception", {
      success: false,
      code: status,
      message,
      $event: { name: client.event, payload: data },
    });
  }

  handleHttpException(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    const deviceLang = request.headers[RestApiHeaders.DEVICE_LANG];
    const errorCode = exception.message;

    if (exception instanceof ValidationFailed) {
      return response.status(exception.getStatus()).send({
        success: false,
        message: exception.message,
        errors: exception.getErrors(),
      });
    }

    let message =
      exception.message || "Something went wrong. Please try again later";

    const status = exception.status ? exception.status : 500;
    message = exception.status ? message : "Internal Server Error";

    return response.status(status).send({
      success: false,
      code: status,
      message,
    });
  }
}
