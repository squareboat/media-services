import * as ffmpeg from "fluent-ffmpeg";
import { Injectable, Inject } from "@nestjs/common";
import {
  MediaWorkerOptions,
  VideoCompressInputs,
  VideoVariant,
} from "../options";
import { MEDIA_WORKER_LIB_OPTIONS, qualityCRFMap } from "../constant";
import * as path from "path";
import { ulid } from "ulid";
import * as fs from "fs";
import { Storage } from "@squareboat/nest-storage";
import { Helper } from "@libs/boat/utils/helper";
import * as mime from "mime-types";

@Injectable()
export class CompressVideo {
  constructor(
    @Inject(MEDIA_WORKER_LIB_OPTIONS) private options: MediaWorkerOptions
  ) {}

  async compressVideo(
    videoBuffer: Buffer,
    inputs: VideoCompressInputs
  ): Promise<string> {
    const key = Helper.removeExtension(inputs.key);
    const storageDir = this.options.isLocal ? process.cwd() : "/tmp";
    const tempInputPath = path.join(storageDir, `${ulid()}.temp.mp4`);
    const tempFiles: string[] = [];
    const variants = this.options.videos.variants;

    try {
      fs.writeFileSync(tempInputPath, videoBuffer);
      tempFiles.push(tempInputPath);

      for (const option of variants) {
        const mimeType = option.format
          ? mime.lookup(option.format)
          : inputs.contentType;
        const fileExtension =
          option.format || mime.extension(inputs.contentType);
        const outputFileName = `${ulid()}.${fileExtension}`;
        const outputPath = path.join(storageDir, outputFileName);
        tempFiles.push(outputPath);
        await this.compress(tempInputPath, outputPath, option);
        await this.uploadToS3(
          outputPath,
          `${option.path || "video_compress"}/${key}.${fileExtension}`,
          mimeType
        );
      }

      return "success";
    } catch (err) {
      console.error("Error during video compression or upload:", err);
      throw err;
    } finally {
      await this.cleanupFiles(tempFiles);
    }
  }

  private compress(
    inputPath: string,
    outputPath: string,
    option: VideoVariant
  ): Promise<void> {
    const { format, quality = "COMPRESS", dimensions } = option;
    const ffmpegDir = this.options.isLocal ? process.cwd() : "/usr/bin";
    const ffmpegPath = path.join(ffmpegDir, "ffmpeg");
    const crf = qualityCRFMap[quality];
    return new Promise((resolve, reject) => {
      const command = ffmpeg(inputPath)
        .setFfmpegPath(ffmpegPath)
        .videoCodec("libx264")
        .outputOptions(`-crf ${crf}`)
        .save(outputPath);

      if (format) {
        command.outputFormat(format);
      }

      if (dimensions) {
        command.size(dimensions);
      }

      command.on("end", () => resolve()).on("error", (err) => reject(err));
    });
  }

  private async uploadToS3(
    filePath: string,
    s3Key: string,
    mimeType
  ): Promise<void> {
    const fileStream = fs.createReadStream(filePath);
    await Storage.disk(this.options.storageDisk).put(s3Key, fileStream, {
      mimeType,
    });
    console.log(`Uploaded ${s3Key} to S3 🪣`);
  }

  private async cleanupFiles(files: string[]): Promise<void> {
    for (const file of files) {
      try {
        await fs.promises.unlink(file);
        console.log(`Deleted temporary file: ${file} ♼`);
      } catch (err) {
        console.error(`Error deleting file ${file}:`, err);
      }
    }
  }
}
