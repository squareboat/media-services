// lambda.ts
import { Context, Callback, Handler } from "aws-lambda";
import awsLambdaFastify from "@fastify/aws-lambda";
import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { INestApplication } from "@nestjs/common";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import fastify from "fastify";
import {
  ExceptionFilter,
  GenericFunction,
  AttachHelpersGuard,
} from "@libs/boat";
import { useContainer } from "class-validator";
import { ServerOptions } from "../interface";

export class ApiAndEventServer {
  private module: any;
  private fastify: any;
  private options: ServerOptions;
  private cachedApiServer: any;
  private cachedAppInstance: INestApplication;
  private eventListener: GenericFunction;

  constructor(module: any, options?: ServerOptions) {
    this.module = module;
    this.fastify = fastify({ logger: true });
    this.options = options || {};
  }

  addEventListener(eventListener: GenericFunction): this {
    this.eventListener = eventListener;
    return this;
  }

  /**
   * Make the instance of a event handler
   *
   * @returns Handler
   */
  make(): Handler {
    return async (
      event: Record<string, any>,
      context: Context,
      callback: Callback
    ) => {
      console.log("event @@@> ", event);

      if (event.source === "serverless-plugin-warmup") {
        return callback(null, "Lambda is warm!");
      }

      if (!this.cachedApiServer || !this.cachedAppInstance) {
        [this.cachedApiServer, this.cachedAppInstance] =
          await this.createApiServer();
      } else {
        console.log("using cached server ====> ");
      }

      if (event.requestContext) {
        return this.cachedApiServer(event, context);
      }

      const task = await this.cachedAppInstance.get(this.eventListener, {
        strict: false,
      });

      return task.handle(event, context, callback);
    };
  }

  /**
   * Create instance of fastify lambda server
   * @returns Promise<INestApplication>
   */
  async createApiServer(): Promise<any[]> {
    const app = await NestFactory.create(
      this.module,
      new FastifyAdapter(this.fastify),
      { logger: false }
    );

    if (this.options.addValidationContainer) {
      useContainer(app.select(this.module), { fallbackOnErrors: true });
    }

    // app.enableCors({ origin: true });

    app.useGlobalGuards(new AttachHelpersGuard());
    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new ExceptionFilter(httpAdapter));

    if (this.options.globalPrefix) {
      app.setGlobalPrefix(this.options.globalPrefix);
    }

    await app.init();

    return [awsLambdaFastify(this.fastify, { decorateRequest: true }), app];
  }
}
