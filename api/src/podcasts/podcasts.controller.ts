import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { PodcastsService } from "./podcasts.service";
import { CreatePodcastsDto } from "./dto/create-podcasts.dto";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { User } from "src/users/schema/users.schema";
import { CurrentUser } from "src/auth/current-user.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { UpdatePodcastsDto } from "./dto/update-podcasts.dto";

@Controller("podcasts")
export class PodcastsController {
  constructor(private readonly podcastsService: PodcastsService) {}

  @Get() // GET /api/podcasts
  async findAll(@Query("tags") tags?: string) {
    const parsedTags = tags ? tags.split(",") : undefined;
    const podcasts = await this.podcastsService.findAll(parsedTags);
    return podcasts;
  }

  @Get("limit") // GET /api/podcasts/limit
  async findLimit(
    @Query("tags") tags?: string,
    @Query("limit") limit = "4",
    @Query("page") page = "1"
  ) {
    const parsedTags = tags ? tags.split(",") : undefined;
    const podcasts = await this.podcastsService.findLimit(
      parsedTags,
      parseInt(limit),
      parseInt(page)
    );
    return podcasts;
  }

  @Get("user") // GET /api/podcasts/user
  @UseGuards(JwtAuthGuard)
  async findCurrentUserPodcasts(@CurrentUser() user: User) {
    if (!user) {
      throw new UnauthorizedException("User is not authenticated");
    }
    return await this.podcastsService.findCurrentUserPodcasts(user);
  }

  @Get("count") // GET /api/podcasts/count
  async countPodcasts() {
    return await this.podcastsService.countPodcasts();
  }

  @Get(":id") // GET /api/podcasts/:id
  async findOne(@Param("id") id: string) {
    return this.podcastsService.findOne(id);
  }

  @Post("create")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: "image", maxCount: 1 },
      { name: "audio", maxCount: 1 },
    ])
  )
  async createPodcast(
    @Body() createPodcastsDto: CreatePodcastsDto,
    @UploadedFiles()
    files: { image?: Express.Multer.File[]; audio?: Express.Multer.File[] },
    @CurrentUser() user: User
  ) {
    if (!user) {
      throw new UnauthorizedException("User is not authenticated");
    }

    return this.podcastsService.createPodcast(createPodcastsDto, files, user);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: "image", maxCount: 1 },
      { name: "audio", maxCount: 1 },
    ])
  )
  async update(
    @Param("id") id: string,
    @Body() updatePodcastsDto: UpdatePodcastsDto,
    @UploadedFiles()
    files: { image?: Express.Multer.File[]; audio?: Express.Multer.File[] }
  ) {
    return this.podcastsService.update(id, updatePodcastsDto, files);
  }

  @Delete(":id")
  async deleteBlog(@Param("id") id: string) {
    return this.podcastsService.delete(id);
  }
}
