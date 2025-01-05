import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CreateUserRequest } from './dto/create-user.request';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from './schema/users.schema';
import { UpdateUserRequest } from './dto/upload-user.request';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //Create User
  @Post()
  async createUser(@Body() request: CreateUserRequest) {
    await this.usersService.create(request);
  }

  @Get() // GET /api/users
  @UseGuards(JwtAuthGuard)
  async getUsers(@CurrentUser() user: User) {
    console.log(user);
    return this.usersService.getUsers();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@CurrentUser() user: User) {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/username')
  async updateCurrentUserUsername(
  @CurrentUser() user: User,
  @Body() body: UpdateUserRequest,
  ) {
    return this.usersService.updateUser(
      { _id: user._id },
      { $set: { username: body.username } }
    );
  }

  @UseGuards(JwtAuthGuard)
    @Patch('me/password')
  async updateCurrentUserPassword(
    @CurrentUser() user: User,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
  const { currentPassword, newPassword } = body;

  if (!currentPassword || !newPassword) {
    throw new BadRequestException('currentPassword and newPassword are required');
  }

  return this.usersService.updateUserPassword(
    user._id.toString(), 
    currentPassword,
    newPassword,
  );
  } 



}
