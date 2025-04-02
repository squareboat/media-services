import { Inject, Injectable } from "@nestjs/common";
import { MEDIA_WORKER_LIB_OPTIONS } from "./constant";
import { CompressMediaDto, MediaWorkerOptions } from "./options";
import { CompressImage } from "./tasks/compressImage";
import { CompressVideo } from "./tasks/compressVideoTask";

@Injectable()
export class MediaWorkerLibService {
  constructor(
    @Inject(MEDIA_WORKER_LIB_OPTIONS) private options: MediaWorkerOptions,
    public compressImageTask: CompressImage,
    public compressVideoTask: CompressVideo
  ) {}
}
