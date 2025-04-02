import { ApiAndEventServer } from "@libs/serverless";
import { Handler } from "aws-lambda";
import { MediaModule } from "./module";
import { MediaCompressHandler } from "./eventListener";

let server: any;
if (!server) {
  server = new ApiAndEventServer(MediaModule);
  server.addEventListener(MediaCompressHandler);
}

export const handler: Handler = server.make();
