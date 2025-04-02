import { ModuleMetadata, Type } from "@nestjs/common";
import { ImageVariant, VideoVariant } from "./interface";
export interface MediaWorkerOptions {
  isLocal: boolean;
  isLambdaEnvironment: boolean;
  storageDisk: string;
  images: {
    variants: ImageVariant[];
  };
  videos: {
    isThumbnail: boolean;
    variants: VideoVariant[];
  };
}

export interface MediaWorkerAsyncOptionsFactory {
  createMediaWorkerOptions(): Promise<MediaWorkerOptions> | MediaWorkerOptions;
}

export interface PdfWorkerAsyncOptions extends Pick<ModuleMetadata, "imports"> {
  name?: string;
  useExisting?: Type<MediaWorkerOptions>;
  useClass?: Type<MediaWorkerAsyncOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<MediaWorkerOptions> | MediaWorkerOptions;
  inject?: any[];
}
