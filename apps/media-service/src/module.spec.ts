import { Test, TestingModule } from "@nestjs/testing";
import { Injectable } from "@nestjs/common";
import sharp from "sharp";
import {
  CompressImage,
  MediaWorkerAsyncOptionsFactory,
  MediaWorkerLibService,
  MediaWorkerModule,
  MediaWorkerOptions,
} from "@libs/media-worker";
import { MediaModule } from "./module";
import { MediaCompressHandler } from "./eventListener";

const workerOptions = {
  isLocal: true,
  isLambdaEnvironment: false,
  storageDisk: "compress",
  images: { variants: [{ width: 50, height: 40, path: "img_small", format: "webp" }] },
  videos: { isThumbnail: false, variants: [] },
} as MediaWorkerOptions;

@Injectable()
class WorkerOptionsFactory implements MediaWorkerAsyncOptionsFactory {
  createMediaWorkerOptions(): MediaWorkerOptions {
    return workerOptions;
  }
}

describe("MediaModule", () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({ imports: [MediaModule] }).compile();
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  it("wires the S3 event handler and the media worker", () => {
    expect(app.get(MediaCompressHandler)).toBeInstanceOf(MediaCompressHandler);
    expect(app.get(MediaWorkerLibService)).toBeInstanceOf(MediaWorkerLibService);
  });
});

describe("MediaWorkerModule.registerAsync", () => {
  it("resolves options from a useClass factory", async () => {
    const app = await Test.createTestingModule({
      imports: [MediaWorkerModule.registerAsync({ useClass: WorkerOptionsFactory })],
    }).compile();

    expect(app.get(MediaWorkerLibService)["options"]).toEqual(workerOptions);
    await app.close();
  });
});

describe("CompressImage.compress", () => {
  it("resizes and converts an image with sharp", async () => {
    const png = await sharp({
      create: { width: 200, height: 100, channels: 3, background: "#ff0000" },
    })
      .png()
      .toBuffer();

    const task = new CompressImage(workerOptions);
    const res = await task.compress(png, workerOptions.images.variants[0]);
    const out = await sharp(res.buffer).metadata();

    expect(res.format).toBe("webp");
    expect(out.format).toBe("webp");
    expect(out.width).toBe(50);
    expect(out.height).toBe(25);
    expect(Math.round(res.stats.channels[0].mean)).toBe(255);
  });
});
