import { HttpAdapterHost, NestFactory, Reflector } from "@nestjs/core";
import { useContainer } from "class-validator";
import { ServerOptions } from "./interfaces";
import { ConfigService } from "@nestjs/config";
import { ExceptionFilter } from "../exceptions";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { TimeoutInterceptor } from "./interceptors/timeoutInterceptor";
import { AttachHelpersGuard } from "./guards/attachHelpers";
import { RestApiInterceptor } from "./guards/restDebugger";

export class RestServer {
  private module: any;
  private options: ServerOptions<NestFastifyApplication>;

  /**
   * Create instance of fastify lambda server
   * @returns Promise<INestApplication>
   */

  static async make(
    module: any,
    options?: ServerOptions<NestFastifyApplication>
  ): Promise<void> {
    const app = await NestFactory.create<NestFastifyApplication>(
      module,
      new FastifyAdapter()
    );

    const config = app.get(ConfigService, { strict: false });

    if (options?.addValidationContainer) {
      useContainer(app.select(module), { fallbackOnErrors: true });
    }

    options?.initAdapters && (await options.initAdapters(app));

    app.enableCors({ origin: true });
    app.useGlobalGuards(new AttachHelpersGuard());

    const reflector = app.get(Reflector);

    // app.useGlobalGuards(new ApiSecretGuard(reflector));

    app.useGlobalInterceptors(new TimeoutInterceptor());

    if (config.get("app.rest.interceptRequests")) {
      app.useGlobalInterceptors(new RestApiInterceptor());
    }

    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new ExceptionFilter(httpAdapter));
    options.globalPrefix && app.setGlobalPrefix(options.globalPrefix);

    const port = options.port || config.get<number>("app.port");
    console.log(
      "🚀 ~ file: restServer.ts:67 ~ RestServer ~ options.port:",
      module.name,
      options.port
    );
    await app.listen(port, "0.0.0.0");
  }
}
