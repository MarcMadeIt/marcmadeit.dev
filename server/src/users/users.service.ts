import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/users.schema';
import { FilterQuery, isValidObjectId, Model, UpdateQuery } from 'mongoose';
import { CreateUserRequest } from './dto/create-user.request';
import { hash } from 'bcryptjs';
import * as bcryptjs from 'bcryptjs';
import { UpdateUserRequest } from './dto/upload-user.request';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(data: CreateUserRequest): Promise<User> {
    const existingUser = await this.userModel.findOne({ username: data.username });
    if (existingUser) {
      throw new ConflictException('User with this username already exists');
    }

    const hashedPassword = await hash(data.password, 10);
    const newUser = new this.userModel({
      ...data,
      password: hashedPassword,
    });
    return newUser.save();
  }

  async getUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async getUser(query: FilterQuery<User>): Promise<User> {
    const user = await this.userModel.findOne(query);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(id: string, updates: UpdateUserRequest): Promise<User> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid user ID format');
    }
  
    const user = await this.userModel.findById(id);
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    if (updates.username) {
      user.username = updates.username;
    }
  
    if (updates.password) {
      const { currentPassword, newPassword } = updates.password;
  
      if (!currentPassword || !newPassword) {
        throw new BadRequestException(
          'Both current and new passwords are required',
        );
      }
  
      const isPasswordValid = await bcryptjs.compare(currentPassword, user.password);
  
      if (!isPasswordValid) {
        throw new BadRequestException('Incorrect current password');
      }
  
      user.password = await bcryptjs.hash(newPassword, 10);
    }
  
    await user.save();
    return user;
  }
  

}
