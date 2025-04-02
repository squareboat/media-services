import { Inject, Injectable } from "@nestjs/common";
import * as sharp from "sharp";
import { get, pick } from "lodash";
import { Storage } from "@squareboat/nest-storage";
import { CompressImageResponse, MediaWorkerOptions } from "../options";
import { MEDIA_WORKER_LIB_OPTIONS } from "../constant";

@Injectable()
export class CompressImage {
  constructor(
    @Inject(MEDIA_WORKER_LIB_OPTIONS) private options: MediaWorkerOptions
  ) {}

  /**
   *
   * @param image string | buffer
   * @param options Record<string, any>
   *
   * Function to compress image with specific options
   */
  async compress(image: string | Buffer, options: Record<string, any>) {
    const s = sharp(image);

    if (options.format === "jpeg") {
      const formatOptions = {
        quality: get(options, "quality", 90),
        progressive: true,
      };
      s.toFormat("jpeg", formatOptions);
    } else if (options.format === "webp") {
      const formatOptions = {
        quality: get(options, "quality", 90),
      };
      s.toFormat("webp", formatOptions);
    }

    if (options.width && options.height) {
      const resizeOptions: Record<string, any> = pick(options, [
        "width",
        "height",
      ]);
      if (get(options, "aspectRatio", true)) {
        resizeOptions.fit = "inside";
      }

      s.resize(resizeOptions);
    }

    if (options.blur) {
      s.blur();
    }

    s.withMetadata();

    return {
      meta: await s.metadata(),
      stats: await s.stats(),
      buffer: await s.toBuffer(),
    };
  }

  async compressImage(
    image: Buffer,
    inputs: Record<string, any>
  ): Promise<CompressImageResponse> {
    const promises = [];
    const variants = this.options.images.variants;

    for (const option of variants) {
      promises.push(this.compress(image, option));
    }

    const responses = await Promise.all(promises);
    const imageResponses: any[] = [];
    for (const i in responses) {
      imageResponses[i] = { res: responses[i], variant: variants[i] };
    }

    const newPromises = [];
    const payload = {
      variants: [],
      status: "success",
      msg: "success",
    } as CompressImageResponse;

    for (const response of imageResponses) {
      const {
        channels: [rc, gc, bc],
      } = response.res.stats;

      const {
        width: originalWidth,
        height: originalHeight,
        channels: originalChannels,
      } = response.res.meta;

      payload["dimensions"] = {
        originalWidth,
        originalHeight,
        originalChannels,
      };

      payload["dominantColor"] = {
        r: Math.round(rc.mean),
        g: Math.round(gc.mean),
        b: Math.round(bc.mean),
      };

      if (Array.isArray(payload["variants"])) {
        payload["variants"].push(response.variant);
      }

      let path = `${response.variant.path}/${inputs.key}`;

      newPromises.push(
        Storage.disk(this.options.storageDisk).put(path, response.res.buffer, {
          mimeType: response.res.meta.format,
        })
      );
    }

    await Promise.allSettled(newPromises);

    return payload;
  }
}
