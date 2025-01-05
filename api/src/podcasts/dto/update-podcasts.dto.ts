import { PartialType } from "@nestjs/mapped-types";
import { CreatePodcastsDto } from "./create-podcasts.dto";

export class UpdatePodcastsDto extends PartialType(CreatePodcastsDto) {}