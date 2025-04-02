import { DynamicModule, Global, Module, Provider, Type } from "@nestjs/common";
import { MEDIA_WORKER_LIB_OPTIONS } from "./constant";
import { MediaWorkerLibService } from "./service";
import { CompressImage } from "./tasks/compressImage";
import {
  MediaWorkerAsyncOptionsFactory,
  MediaWorkerOptions,
  PdfWorkerAsyncOptions,
} from "./options";
import { CompressVideo } from "./tasks/compressVideoTask";

@Global()
@Module({})
export class MediaWorkerModule {
  /**
   * Register options
   * @param options
   */
  static register(options: NotificationOptions): DynamicModule {
    return {
      global: false,
      module: MediaWorkerModule,
      imports: [],
      providers: [
        MediaWorkerLibService,
        CompressImage,
        CompressVideo,
        { provide: MEDIA_WORKER_LIB_OPTIONS, useValue: options },
      ],
      exports: [MediaWorkerLibService],
    };
  }

  /**
   * Register Async Options
   */
  static registerAsync(options: PdfWorkerAsyncOptions): DynamicModule {
    return {
      global: false,
      module: MediaWorkerModule,
      imports: [],
      providers: [
        MediaWorkerLibService,
        CompressImage,
        CompressVideo,
        this.createPdfWorkerOptionsProvider(options),
      ],
      exports: [MediaWorkerLibService],
    };
  }

  private static createPdfWorkerOptionsProvider(
    options: PdfWorkerAsyncOptions
  ): Provider {
    if (options.useFactory) {
      return {
        provide: MEDIA_WORKER_LIB_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    const inject = [
      (options.useClass || options.useExisting) as Type<MediaWorkerOptions>,
    ];

    return {
      provide: MEDIA_WORKER_LIB_OPTIONS,
      useFactory: async (optionsFactory: MediaWorkerAsyncOptionsFactory) =>
        await optionsFactory.createMediaWorkerOptions(),
      inject,
    };
  }
}
