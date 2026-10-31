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
      // optional, for S3-compatible servers such as MinIO or LocalStack
      endpoint: process.env.AWS_S3_ENDPOINT,
      forcePathStyle: process.env.AWS_S3_FORCE_PATH_STYLE === "true",
    },
    compress: {
      driver: "s3",
      bucket: process.env.AWS_S3_COMPRESS_BUCKET,
      accessKey: process.env.AWS_KEY,
      secretKey: process.env.AWS_SECRET,
      region: process.env.APP_AWS_REGION,
      endpoint: process.env.AWS_S3_ENDPOINT,
      forcePathStyle: process.env.AWS_S3_FORCE_PATH_STYLE === "true",
    },
  },
}));
