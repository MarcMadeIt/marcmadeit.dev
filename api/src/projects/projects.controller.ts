import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { S3Service } from 'src/config/aws/s3.service';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProjectsDto } from './dto/create-projects.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/users/schema/users.schema';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService
  ) {}

  @Get()
  async findAll(@Query('tags') tags?: string) {
    const parsedTags = tags ? tags.split(',') : undefined;
    const projects = await this.projectsService.findAll(parsedTags);
    return projects;
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async createBlog(
    @Body() createProjectsDto: CreateProjectsDto,
    @UploadedFile() file: Express.Request['file'],
    @CurrentUser() user: User,
  ) {
    if (!user) {
      throw new UnauthorizedException('User is not authenticated');
    }

    return this.projectsService.createProject(createProjectsDto, file, user);
  }

  @Get(':id') // GET /projects/:id
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Delete(':id') // Forventet endpoint
  async deleteBlog(@Param('id') id: string) {
    return this.projectsService.delete(id);
  }
}
