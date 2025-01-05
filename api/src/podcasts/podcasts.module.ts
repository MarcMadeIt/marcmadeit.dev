import { Module } from '@nestjs/common';
import { PodcastsService } from './podcasts.service';
import { PodcastsController } from './podcasts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Podcast, PodcastSchema } from './schema/podcasts.schema';
import { S3Service } from 'src/config/aws/s3.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Podcast.name, schema: PodcastSchema }]),
  ],
  providers: [PodcastsService, S3Service],
  controllers: [PodcastsController],
  exports: [PodcastsService]
})
export class PodcastsModule {}
