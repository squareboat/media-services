import * as path from "path";

export class Helper {
  static removeExtension(filename: string) {
    return path.parse(filename)?.name;
  }
}
