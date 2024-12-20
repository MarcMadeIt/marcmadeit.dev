import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type PodcastDocument = HydratedDocument<Podcast>;

@Schema({ collection: 'podcasts', timestamps: true })
export class Podcast {
  @Prop({ required: true })
  title: string;

  @Prop()
  desc: string;

  @Prop([String])
  tags: string[];

  @Prop()
  imageinfo: string;

  @Prop()
  audioinfo: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  author: MongooseSchema.Types.ObjectId;
}

export const PodcastSchema = SchemaFactory.createForClass(Podcast);




