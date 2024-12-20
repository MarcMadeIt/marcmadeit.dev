import { IsArray, ArrayMinSize, IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';

export class CreateBlogsDto {
  @IsString()
  title: string;

  @IsString()
  desc: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => 
    typeof value === 'string' ? JSON.parse(value) : value)
  tags?: string[];

  @IsOptional()
  @IsString()
  imageinfo?: string;

  @IsOptional()
  author: Types.ObjectId; // Ændr typen til ObjectId
}