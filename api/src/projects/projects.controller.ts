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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ProjectsService } from "./projects.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreateProjectsDto } from "./dto/create-projects.dto";

import { CurrentUser } from "src/auth/current-user.decorator";
import { User } from "src/users/schema/users.schema";
import { UpdateProjectsDto } from "./dto/update-projects.dto";

@Controller("projects")
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async findAll(@Query("tags") tags?: string) {
    const parsedTags = tags ? tags.split(",") : undefined;
    const projects = await this.projectsService.findAll(parsedTags);
    return projects;
  }

  @Get("user") // GET /api/projects/user
  @UseGuards(JwtAuthGuard)
  async findCurrentUserProjects(@CurrentUser() user: User) {
    if (!user) {
      throw new UnauthorizedException("User is not authenticated");
    }
    return await this.projectsService.findCurrentUserProjects(user);
  }

  @Get("count") // GET /api/projects/count
  async countProjects() {
    return await this.projectsService.countProjects();
  }

  @Get("limit") // GET /api/projects/limit
  async findLimit(
    @Query("tags") tags?: string,
    @Query("limit") limit = "4",
    @Query("page") page = "1"
  ) {
    const parsedTags = tags && tags.trim() ? tags.split(",") : undefined;
    const parsedLimit = isNaN(Number(limit)) ? 4 : Number(limit); // Ensure valid limit
    const parsedPage = isNaN(Number(page)) ? 1 : Number(page); // Ensure valid page

    const projectsData = await this.projectsService.findLimit(
      parsedTags,
      parsedLimit,
      parsedPage
    );
    return projectsData;
  }

  @Post("create")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor("file"))
  async createProject(
    @Body() createProjectsDto: CreateProjectsDto,
    @UploadedFile() file: Express.Request["file"],
    @CurrentUser() user: User
  ) {
    if (!user) {
      throw new UnauthorizedException("User is not authenticated");
    }

    return this.projectsService.createProject(createProjectsDto, file, user);
  }

  @Get(":id") // GET /projects/:id
  findOne(@Param("id") id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(":id") // PATCH /api/projects/:id
  @UseInterceptors(FileInterceptor("file"))
  async update(
    @Param("id") id: string,
    @Body() updateProjectsDto: UpdateProjectsDto,
    @UploadedFile() file: Express.Request["file"]
  ) {
    return this.projectsService.update(id, updateProjectsDto, file);
  }

  @Delete(":id") // Forventet endpoint
  async deleteBlog(@Param("id") id: string) {
    return this.projectsService.delete(id);
  }
}
