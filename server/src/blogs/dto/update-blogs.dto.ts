import { CreateBlogsDto } from "./create-blogs.dto";
import { PartialType } from "@nestjs/mapped-types";

export class UpdateBlogsDto extends PartialType(CreateBlogsDto) {}