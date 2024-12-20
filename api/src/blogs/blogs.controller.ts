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
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogsDto } from './dto/create-blogs.dto';
import { UpdateBlogsDto } from './dto/update-blogs.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/users/schema/users.schema';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Get() // GET /api/blogs
  async findAll(@Query('tags') tags?: string) {
    const parsedTags = tags ? tags.split(',') : undefined;
    const blogs = await this.blogsService.findAll(parsedTags);
    return blogs;
  }

  @Get('limit') // GET /api/blogs/limit
  async findLimit(
    @Query('tags') tags?: string,
    @Query('limit') limit = '3',
    @Query('page') page = '1',
  ) {
    const parsedTags = tags ? tags.split(',') : undefined;
    const blogs = await this.blogsService.findLimit(
      parsedTags,
      parseInt(limit),
      parseInt(page),
    );
    return blogs;
  }

  @Get('latest') // GET /api/blogs/latest
  async findLatest() {
    const limit = 2; // Fetch the two latest blogs
    const blogs = await this.blogsService.findLatest(limit);
    return blogs;
  }

  @Get(':id') // GET /api/blogs/:id
  findOne(@Param('id') id: string) {
    return this.blogsService.findOne(id);
  }

  @Post('create') // GET /api/blogs/create
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async createBlog(
    @Body() createBlogsDto: CreateBlogsDto,
    @UploadedFile() file: Express.Request['file'],
    @CurrentUser() user: User,
  ) {
    if (!user) {
      throw new UnauthorizedException('User is not authenticated');
    }

    return this.blogsService.createBlog(createBlogsDto, file, user);
  }

  @Patch(':id') // PATCH /api/blogs/:id
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogsDto) {
    return this.blogsService.update(id, updateBlogDto);
  }

  @Delete(':id') // Forventet endpoint
  async deleteBlog(@Param('id') id: string) {
    return this.blogsService.delete(id);
  }
}
