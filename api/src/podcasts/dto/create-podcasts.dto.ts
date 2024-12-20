import { IsArray, IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';

export class CreatePodcastsDto {
  @IsString()
  title: string;

  @IsString()
  desc: string;

  @IsArray()
  @Transform(({ value }) => JSON.parse(value))  
  tags: string[];

  @IsOptional()
  @IsString()
  imageinfo?: string;

  @IsOptional()
  @IsString()
  audioinfo?: string;

  @IsOptional()
  author: Types.ObjectId;
}