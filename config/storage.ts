import { registerAs } from "@nestjs/config";
export default registerAs("storage", () => ({
  default: "original",
  disks: {
    original: {
      driver: "s3",
      bucket: process.env.AWS_S3_ORIGINAL_BUCKET,
      accessKey: process.env.AWS_KEY,
      secretKey: process.env.AWS_SECRET,
      region: process.env.APP_AWS_REGION,
    },
    compress: {
      driver: "s3",
      bucket: process.env.AWS_S3_COMPRESS_BUCKET,
      accessKey: process.env.AWS_KEY,
      secretKey: process.env.AWS_SECRET,
      region: process.env.APP_AWS_REGION,
    },
  },
}));
