import { IsArray, IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';

export class CreatePodcastsDto {
  @IsString()
  title: string;

  @IsString()
  desc: string;

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => 
    typeof value === 'string' ? JSON.parse(value) : value)
  tags?: string[];

  @IsOptional()
  @IsString()
  imageinfo?: string;

  @IsOptional()
  @IsString()
  audioinfo?: string;

  @IsOptional()
  author: Types.ObjectId;
}