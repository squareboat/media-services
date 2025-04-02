import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class SearchableDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  q: string;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  page: number = 1;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  perPage: number = 15;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => parseInt(value))
  paginate: boolean = true;
}
