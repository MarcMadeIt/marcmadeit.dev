import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type BlogDocument = HydratedDocument<Blog>;

@Schema({ collection: 'blogs', timestamps: true })
export class Blog {
  @Prop({ required: true })
  title: string;

  @Prop()
  desc: string;

  @Prop()
  content: string;

  @Prop([String])
  tags: string[];

  @Prop()
  imageinfo: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  author: MongooseSchema.Types.ObjectId;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
