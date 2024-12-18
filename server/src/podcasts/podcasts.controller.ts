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
} from '@nestjs/common';
import { PodcastsService } from './podcasts.service';
import { CreatePodcastsDto } from './dto/create-podcasts.dto';
import { FileFieldsInterceptor} from '@nestjs/platform-express';
import { User } from 'src/users/schema/users.schema';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdatePodcastsDto } from './dto/upload-podcasts.dto';

@Controller('podcasts')
export class PodcastsController {
  constructor(private readonly podcastsService: PodcastsService) {}



  @Get() // GET /api/podcasts
  async findAll(@Query('tags') tags?: string) {
    const parsedTags = tags ? tags.split(',') : undefined;
    const podcasts = await this.podcastsService.findAll(parsedTags);
    return podcasts;
  }

  @Get('limit') // GET /api/podcasts/limit
  async findLimit(
    @Query('tags') tags?: string,
    @Query('limit') limit = '3',
    @Query('page') page = '1',
  ) {
    const parsedTags = tags ? tags.split(',') : undefined;
    const podcasts = await this.podcastsService.findLimit(
      parsedTags,
      parseInt(limit),
      parseInt(page),
    );
    return podcasts;
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'image', maxCount: 1 },
    { name: 'audio', maxCount: 1 },
  ]))
  async createPodcast(
    @Body() createPodcastsDto: CreatePodcastsDto,
    @UploadedFiles() files: { image: Express.Multer.File[], audio: Express.Multer.File[] }, // Handle multiple files
    @CurrentUser() user: User,
  ) {
    if (!user) {
      throw new UnauthorizedException('User is not authenticated');
    }
  
    return this.podcastsService.createPodcast(createPodcastsDto, files, user);
  }


  @Patch(':id') 
  update(
    @Param('id') id: string,
    @Body() updatePodcastsDto: UpdatePodcastsDto,
  ) {
    return this.podcastsService.update(id, updatePodcastsDto);
  }

  @Delete(':id') // Forventet endpoint
  async deleteBlog(@Param('id') id: string) {
    return this.podcastsService.delete(id);
  }
}
