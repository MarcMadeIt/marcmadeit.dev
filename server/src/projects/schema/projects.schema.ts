import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type ProjectDocument = HydratedDocument<Project>;

@Schema({ collection: 'projects', timestamps: true })
export class Project {
  @Prop({ required: true })
  title: string;

  @Prop()
  desc: string;

  @Prop()
  link: String;

  @Prop()
  github: String;

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

export const ProjectSchema = SchemaFactory.createForClass(Project);
