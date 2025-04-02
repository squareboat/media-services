import { MediaWorkerOptions } from "@libs/media-worker";
import { registerAs } from "@nestjs/config";

export default registerAs(
  "media",
  () =>
    ({
      isLocal: process.env.NODE_ENV === "local",
      storageDisk: "compress",
      videos: {
        isThumbnail: false,
        variants: [
          {
            path: "video_large",
            quality: "HIGH",
            dimensions: "1920x1080",
          },
          {
            path: "video_medium",
            quality: "BALANCED",
          },
          {
            path: "video_small",
            quality: "COMPRESS",
          },
        ],
      },
      images: {
        variants: [
          {
            width: 500,
            height: 480,
            path: "img_small_webp",
            format: "webp",
          },
          {
            width: 854,
            height: 480,
            path: "img_medium_webp",
            format: "webp",
          },
          {
            width: 1200,
            height: 630,
            path: "img_social_webp",
            format: "webp",
          },
          {
            width: 1920,
            height: 1080,
            path: "img_large_webp",
            format: "webp",
          },
          {
            width: 500,
            height: 480,
            path: "img_small",
            format: "png",
          },
          {
            width: 854,
            height: 480,
            path: "img_medium",
            format: "png",
          },
          {
            width: 1200,
            height: 630,
            path: "img_social",
            format: "png",
          },
          {
            width: 1920,
            height: 1080,
            path: "img_large",
            format: "png",
          },
        ],
      },
    }) as MediaWorkerOptions
);
