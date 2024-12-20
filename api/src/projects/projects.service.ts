import { Injectable, NotFoundException } from '@nestjs/common';
import { Project, ProjectDocument } from './schema/projects.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateProjectsDto } from './dto/upload-projects.dto';
import { S3Service } from 'src/config/aws/s3.service';
import { CreateProjectsDto } from './dto/create-projects.dto';
import { User } from 'src/users/schema/users.schema';
import { Blog } from 'src/blogs/schemas/blogs.schema';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    private readonly s3Service: S3Service,
  ) {}

   // GET ALL PROJECT

  async findAll(tags?: string[]): Promise<Project[]> {
    const query = tags && tags.length > 0 ? { tags: { $in: tags } } : {};

    const projects = await this.projectModel
      .find(query)
      .sort({ createdAt: -1 })
      .exec();

    return projects;
  }

    // GET SPECIFIC PROJECT

  async findOne(id: string): Promise<Project> {
    const project = await this.projectModel.findById(id).exec();
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  // CREATE PROJECT

  async createProject(
    createProjectsDto: CreateProjectsDto,
    file: Express.Request['file'],
    user: User,
  ): Promise<Project> {
    let imageinfo: string | null = null;
  
    if (file) {
      imageinfo = await this.s3Service.uploadFile(file.buffer, file.mimetype);
    }
  
    const tagsArray = Array.isArray(createProjectsDto.tags)
      ? createProjectsDto.tags
      : typeof createProjectsDto.tags === 'string'
        ? JSON.parse(createProjectsDto.tags)
        : [];
  
    const projectData = {
      ...createProjectsDto,
      tags: tagsArray,
      imageinfo,
      author: user._id,
    };
  
    const newProject = new this.projectModel(projectData);
    return newProject.save();
  }


  // UPDATE PROJECT

  async update(
    id: string,
    updateProjectsDto: UpdateProjectsDto,
  ): Promise<Project> {
    const updatedProject = await this.projectModel
      .findByIdAndUpdate(id, updateProjectsDto, { new: true })
      .exec();

    if (!updatedProject) {
      throw new NotFoundException('Project not found');
    }
    return updatedProject;
  }

   // DELETE PROJECT

  async delete(id: string): Promise<Project> {
    const projectToDelete = await this.projectModel
      .findByIdAndDelete(id)
      .exec();

    if (!projectToDelete) {
      throw new NotFoundException('Blog not found', id);
    }

    // Fjern billede fra S3
    if (projectToDelete.imageinfo) {
      const s3Key = new URL(projectToDelete.imageinfo).pathname.substring(1);
      await this.s3Service.deleteFile(s3Key);
    }

    return projectToDelete;
  }
}
