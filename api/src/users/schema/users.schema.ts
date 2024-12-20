import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MinLength } from 'class-validator';
import { HydratedDocument, Schema as MongooseSchema, SchemaType, SchemaTypes, Types } from 'mongoose';

export type UsersDocument = HydratedDocument<User>;

@Schema({ collection: 'users', timestamps: true })
export class User {
  @Prop({ type: SchemaTypes.ObjectId, auto:true })
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop()
  refreshToken?: string

  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Prop({ required: true })
  password: string;

}

export const UserSchema = SchemaFactory.createForClass(User);
