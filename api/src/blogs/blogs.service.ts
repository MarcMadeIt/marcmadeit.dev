import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateBlogsDto } from './dto/create-blogs.dto';
import { UpdateBlogsDto } from './dto/update-blogs.dto';
import { Blog, BlogDocument } from './schemas/blogs.schema';
import { S3Service } from 'src/config/aws/s3.service';
import { User } from 'src/users/schema/users.schema';

@Injectable()
export class BlogsService {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>, private readonly s3Service: S3Service) {}

  // GET ALL BLOGS

  async findAll(tags?: string[]): Promise<Blog[]> {
    const query = tags && tags.length > 0 ? { tags: { $in: tags } } : {};

    const blogs = await this.blogModel
      .find(query)
      .sort({ createdAt: -1 })
      .exec();

    return blogs;
  }

  // GET ALL BLOGS WITH OF 3 ON BLOGS PAGE

  async findLimit(
    tags?: string[],
    limit = 3,
    page = 1,
  ): Promise<{ blogs: Blog[]; totalCount: number }> {
    const query = tags && tags.length > 0 ? { tags: { $in: tags } } : {};
  
    const blogs = await this.blogModel
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .populate('author', 'username') 
      .exec();
  
    const totalCount = await this.blogModel.countDocuments(query).exec();
  
    return { blogs, totalCount };
  }

  // GET ALL BLOGS WITH LIMIT OF 2 HOME PAGE

  async findLatest(limit: number): Promise<Blog[]> {
    return this.blogModel
      .find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('author', 'username') 
      .exec();
  }

  // GET ALL BLOGS BY USER

  async findCurrentUserBlogs(user: User): Promise<Blog[]> {
    return this.blogModel
      .find({ author: user._id })
      .sort({ createdAt: -1 })
      .populate('author', 'username')
      .exec();
  }

  // GET ONE BLOG WITH ID

  async findOne(id: string): Promise<Blog> {
    const blog = await this.blogModel.findById(id).exec();
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    return blog;
  }

  // GET BLOG COUNT
  async countBlogs(): Promise<number> {
    return this.blogModel.countDocuments().exec();
  }
  
  // CREATE BLOG

  async createBlog(
    createBlogsDto: CreateBlogsDto,
    file: Express.Request['file'],
    user: User,
  ): Promise<Blog> {
    let imageinfo: string | null = null;
  
    if (file) {
      imageinfo = await this.s3Service.uploadFile(file.buffer, file.mimetype);
    }
  
    const tagsArray = Array.isArray(createBlogsDto.tags)
      ? createBlogsDto.tags
      : typeof createBlogsDto.tags === 'string'
        ? JSON.parse(createBlogsDto.tags)
        : [];
  
    const blogData = {
      ...createBlogsDto,
      tags: tagsArray,
      imageinfo,
      author: user._id,
    };
  
    const newBlog = new this.blogModel(blogData);
    return newBlog.save();
  }
  
  

  async update(
    id: string,
    updateBlogsDto: UpdateBlogsDto,
    file?: Express.Request['file'],
  ): Promise<Blog> {
    const existingBlog = await this.blogModel.findById(id).exec();
    if (!existingBlog) {
      throw new NotFoundException('Blog not found');
    }

    if (file) {
      const imageinfo = await this.s3Service.uploadFile(file.buffer, file.mimetype);
      updateBlogsDto.imageinfo = imageinfo;
    }

    if (updateBlogsDto.tags) {
      const tagsArray = Array.isArray(updateBlogsDto.tags)
        ? updateBlogsDto.tags
        : typeof updateBlogsDto.tags === 'string'
          ? JSON.parse(updateBlogsDto.tags)
          : [];
      updateBlogsDto.tags = tagsArray;
    }

    Object.assign(existingBlog, updateBlogsDto);
    return existingBlog.save();
  }

  async delete(id: string): Promise<Blog> {
    const blogToDelete = await this.blogModel.findByIdAndDelete(id).exec();
  
    if (!blogToDelete) {
      throw new NotFoundException('Blog not found', id);
    }
  
    if (blogToDelete.imageinfo) {
      const s3Key = new URL(blogToDelete.imageinfo).pathname.substring(1);
      await this.s3Service.deleteFile(s3Key);
    }
  
    return blogToDelete;
  }
  
}
