import { MediaWorkerLibService } from "@libs/media-worker";
import { Injectable } from "@nestjs/common";
import { Storage } from "@squareboat/nest-storage";

@Injectable()
export class MediaCompressHandler {
  constructor(private readonly service: MediaWorkerLibService) {}
  /**
   * Handle the image compression and any other functionality
   *
   * @returns {void}
   */
  async handle(events: Record<string, any>): Promise<Record<string, any>> {
    for (const record of events.Records) {
      if (!record.s3) return;
      const key: string = record.s3.object.key;
      console.log(record.s3.object.key);
      const meta = await Storage.disk("original").meta(key);
      const { contentType } = meta;
      if (contentType?.match("video.*")) {
        const video = await Storage.disk("original").get(key);
        await this.service.compressVideoTask.compressVideo(video, {
          key: key.split("/").splice(1).join("/"),
          contentType,
        });
      } else if (contentType?.match("image.*")) {
        console.log("running image");
        const image = await Storage.disk("original").get(key);
        await this.service.compressImageTask.compressImage(image, {
          key: key.split("/").splice(1).join("/"),
        });
      } else {
        console.log("excluded", key);
      }
    }
    return { statusCode: 200, body: "" };
  }
}
