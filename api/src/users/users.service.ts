import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {  User } from './schema/users.schema';
import { FilterQuery, isValidObjectId, Model, UpdateQuery } from 'mongoose';
import { CreateUserRequest } from './dto/create-user.request';
import { compare, hash } from 'bcryptjs';


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
    console.log('Query for getUser:', query);
    const user = await this.userModel.findOne(query);
    console.log('Result from getUser', user);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getCurrentUser(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateUser(
    filter: FilterQuery<User>, 
    update: UpdateQuery<User>
  ): Promise<User> {
    // Return the updated user
    const updatedUser = await this.userModel.findOneAndUpdate(filter, update, {
      new: true,
    });

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  }

  async updateUserPassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<User> {
    // 1) Find the user
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 2) Compare the current password with the stored (hashed) password
    const isMatch = await compare(currentPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Current password is incorrect');
    }

    // 3) Hash the new password and save
    user.password = await hash(newPassword, 10);
    const updatedUser = await user.save();

    // (Optionally remove the password field from the returned document)
    updatedUser.password = undefined;
    return updatedUser;
  }

}
