import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { S3Service } from 'src/config/aws/s3.service';
import { CreatePodcastsDto } from './dto/create-podcasts.dto';
import { Podcast, PodcastDocument } from './schema/podcasts.schema';
import { UpdatePodcastsDto } from './dto/update-podcasts.dto';
import { User } from 'src/users/schema/users.schema';

@Injectable()
export class PodcastsService {
  constructor(
    @InjectModel(Podcast.name) private podcastModel: Model<PodcastDocument>,
    private readonly s3Service: S3Service,
  ) {}

  // GET ALL PodcastS

  async findAll(tags?: string[]): Promise<Podcast[]> {
    const query = tags && tags.length > 0 ? { tags: { $in: tags } } : {};

    const Podcasts = await this.podcastModel
      .find(query)
      .sort({ createdAt: -1 })
      .exec();

    return Podcasts;
  }

   // GET LIMIT OF PODCASTS

  async findLimit(
    tags?: string[], 
    limit = 4,
    page = 1,
  ): Promise<{ podcasts: Podcast[]; totalCount: number }> {
    const query = tags && tags.length > 0 ? { tags: { $in: tags } } : {};
  
    const podcasts = await this.podcastModel
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .populate('author', 'username') 
      .exec();
  
    const totalCount = await this.podcastModel.countDocuments(query).exec();
  
    return { podcasts, totalCount };
  }

  // GET ONE Podcast WITH ID

  async findOne(id: string): Promise<Podcast> {
    const Podcast = await this.podcastModel.findById(id).exec();
    if (!Podcast) {
      throw new NotFoundException('Podcast not found');
    }
    return Podcast;
  }

  //Get all podcasts by User

  async findCurrentUserPodcasts(user: User): Promise<Podcast[]> {
    return this.podcastModel
      .find({ author: user._id })
      .sort({ createdAt: -1 })
      .populate('author', 'username')
      .exec();
  }

  //Count all podcasts

  async countPodcasts(): Promise<number> {
    return this.podcastModel.countDocuments().exec();
  }
  

    // CREATE Podcast

    async createPodcast(
      createPodcastsDto: CreatePodcastsDto,
      files: { image?: Express.Multer.File[]; audio?: Express.Multer.File[] },
      user: User,
    ): Promise<Podcast> {
      let imageinfo: string | null = null;
      let audioinfo: string | null = null;
    
      // Handle image upload
      if (files.image && files.image[0]) {
        imageinfo = await this.s3Service.uploadFile(
          files.image[0].buffer,
          files.image[0].mimetype,
        );
        console.log('Image uploaded to S3, URL:', imageinfo);
      }
    
      // Handle audio upload
      if (files.audio && files.audio[0]) {
        audioinfo = await this.s3Service.uploadAudio(
          files.audio[0].buffer,
          files.audio[0].mimetype,
        );
        console.log('Audio uploaded to S3, URL:', audioinfo);
      }
    
      const tagsArray = Array.isArray(createPodcastsDto.tags)
      ? createPodcastsDto.tags
      : typeof createPodcastsDto.tags === 'string'
        ? JSON.parse(createPodcastsDto.tags)
        : [];
    
      const podcastData = {
        ...createPodcastsDto,
        tags: tagsArray,
        imageinfo,
        audioinfo,
        author: user._id,
      };
    
      const newPodcast = new this.podcastModel(podcastData);
      return newPodcast.save();
    }
    
    
  // UPDATE Podcast

  async update(
    id: string,
    updatePodcastsDto: UpdatePodcastsDto,
    files: { image?: Express.Multer.File[]; audio?: Express.Multer.File[] },
  ): Promise<Podcast> {
    const podcast = await this.podcastModel.findById(id).exec();
    if (!podcast) {
      throw new NotFoundException('Podcast not found');
    }

    let imageinfo = podcast.imageinfo;
    let audioinfo = podcast.audioinfo;

    // Handle image upload
    if (files.image && files.image[0]) {
      imageinfo = await this.s3Service.updateFile(
        podcast.imageinfo,
        files.image[0].buffer,
        files.image[0].mimetype,
        'image'
      );
      console.log('Image uploaded to S3, URL:', imageinfo);
    }

    // Handle audio upload
    if (files.audio && files.audio[0]) {
      audioinfo = await this.s3Service.updateFile(
        podcast.audioinfo,
        files.audio[0].buffer,
        files.audio[0].mimetype,
        'audio'
      );
      console.log('Audio uploaded to S3, URL:', audioinfo);
    }

    const tagsArray = Array.isArray(updatePodcastsDto.tags)
      ? updatePodcastsDto.tags
      : typeof updatePodcastsDto.tags === 'string'
        ? JSON.parse(updatePodcastsDto.tags)
        : [];

    const updatedPodcast = await this.podcastModel
      .findByIdAndUpdate(
        id,
        {
          ...updatePodcastsDto,
          tags: tagsArray,
          imageinfo,
          audioinfo,
        },
        { new: true },
      )
      .exec();

    if (!updatedPodcast) {
      throw new NotFoundException('Podcast not found');
    }
    return updatedPodcast;
  }

  // DELETE Podcast

 async delete(id: string): Promise<Podcast> {
  const PodcastToDelete = await this.podcastModel
    .findByIdAndDelete(id)
    .exec();

  if (!PodcastToDelete) {
    throw new NotFoundException('Podcast not found', id);
  }

  if (PodcastToDelete.imageinfo) {
    const imageS3Key = new URL(PodcastToDelete.imageinfo).pathname.substring(1);
    await this.s3Service.deleteFile(imageS3Key);
    console.log("Image file deleted from S3:", imageS3Key);
  }

  if (PodcastToDelete.audioinfo) {
    const audioS3Key = new URL(PodcastToDelete.audioinfo).pathname.substring(1);
    await this.s3Service.deleteFile(audioS3Key);
    console.log("Audio file deleted from S3:", audioS3Key);
  }

  return PodcastToDelete;
}

}
