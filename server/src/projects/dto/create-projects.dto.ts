import { Transform } from 'class-transformer';
import { IsArray, ArrayMinSize, IsString, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateProjectsDto {
  @IsString()
  title: string;

  @IsString()
  desc: string;

  @IsString()
  link: String;

  @IsString()
  github: String;

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => 
    typeof value === 'string' ? JSON.parse(value) : value)
  tags?: string[];

  @IsOptional()
  @IsString()
  imageinfo?: string;

  @IsOptional()
  author: Types.ObjectId;
}
