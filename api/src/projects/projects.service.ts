import { Injectable, NotFoundException } from "@nestjs/common";
import { Project, ProjectDocument } from "./schema/projects.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { UpdateProjectsDto } from "./dto/update-projects.dto";
import { S3Service } from "src/config/aws/s3.service";
import { CreateProjectsDto } from "./dto/create-projects.dto";
import { User } from "src/users/schema/users.schema";

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    private readonly s3Service: S3Service
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

  //GET ALL PROJECTS BY USER

  async findCurrentUserProjects(user: User): Promise<Project[]> {
    return this.projectModel
      .find({ author: user._id })
      .sort({ createdAt: -1 })
      .populate("author", "username")
      .exec();
  }

  //COUNT PROJECTS

  async countProjects(): Promise<number> {
    return this.projectModel.countDocuments().exec();
  }

  // GET SPECIFIC PROJECT

  async findOne(id: string): Promise<Project> {
    const project = await this.projectModel.findById(id).exec();
    if (!project) {
      throw new NotFoundException("Project not found");
    }

    return project;
  }

  // CREATE PROJECT

  async createProject(
    createProjectsDto: CreateProjectsDto,
    file: Express.Request["file"],
    user: User
  ): Promise<Project> {
    let imageinfo: string | null = null;

    if (file) {
      imageinfo = await this.s3Service.uploadFile(file.buffer, file.mimetype);
    }

    const tagsArray = Array.isArray(createProjectsDto.tags)
      ? createProjectsDto.tags
      : typeof createProjectsDto.tags === "string"
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
    file?: Express.Request["file"]
  ): Promise<Project> {
    const existingProject = await this.projectModel.findById(id).exec();
    if (!existingProject) {
      throw new NotFoundException("Project not found");
    }

    if (file) {
      // Delete the existing image from S3
      if (existingProject.imageinfo) {
        const s3Key = new URL(existingProject.imageinfo).pathname.substring(1);
        await this.s3Service.deleteFile(s3Key);
      }

      // Upload the new image to S3
      const imageinfo = await this.s3Service.uploadFile(
        file.buffer,
        file.mimetype
      );
      updateProjectsDto.imageinfo = imageinfo;
    }

    if (updateProjectsDto.tags) {
      const tagsArray = Array.isArray(updateProjectsDto.tags)
        ? updateProjectsDto.tags
        : typeof updateProjectsDto.tags === "string"
          ? JSON.parse(updateProjectsDto.tags)
          : [];
      updateProjectsDto.tags = tagsArray;
    }

    Object.assign(existingProject, updateProjectsDto);
    return existingProject.save();
  }

  // DELETE PROJECT

  async delete(id: string): Promise<Project> {
    const projectToDelete = await this.projectModel
      .findByIdAndDelete(id)
      .exec();

    if (!projectToDelete) {
      throw new NotFoundException("Blog not found", id);
    }

    // Remove image from S3
    if (projectToDelete.imageinfo) {
      const s3Key = new URL(projectToDelete.imageinfo).pathname.substring(1);
      await this.s3Service.deleteFile(s3Key);
    }

    return projectToDelete;
  }

  async findLimit(
    tags?: string[],
    limit = 4,
    page = 1
  ): Promise<{ projects: Project[]; totalCount: number }> {
    const parsedLimit = isNaN(Number(limit)) ? 4 : Number(limit); // Validate limit
    const parsedPage = isNaN(Number(page)) ? 1 : Number(page); // Validate page
    const skip = (parsedPage - 1) * parsedLimit;

    const query = tags && tags.length > 0 ? { tags: { $in: tags } } : {};

    const projects = await this.projectModel
      .find(query)
      .sort({ createdAt: -1 })
      .limit(parsedLimit)
      .skip(skip)
      .populate("author", "username")
      .exec();

    const totalCount = await this.projectModel.countDocuments(query).exec();

    return { projects, totalCount }; // Ensure response structure matches frontend expectations
  }
}
