import { Type } from "class-transformer";
import {
  IsIn,
  IsString,
  ValidateIf,
  IsNotEmpty,
  ValidateNested,
} from "class-validator";

export class S3ConfigDto {
  @IsNotEmpty()
  @IsString()
  bucket?: string;

  @IsNotEmpty()
  @IsString()
  path!: string;
}

export class CompressMediaDto {
  @IsIn(["s3"])
  sourceDisk!: "s3";

  @ValidateNested()
  @ValidateIf((o) => o.sourceDisk === "s3")
  @Type(() => S3ConfigDto)
  s3!: S3ConfigDto;
}
