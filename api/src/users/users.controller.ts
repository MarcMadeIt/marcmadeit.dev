import {
  Body,
  Controller,
  Get,
  Param,
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

  @Get('getusername') // GET /api/users/getusername
@UseGuards(JwtAuthGuard)
async getUser(@CurrentUser() user: User): Promise<{ _id: string; username: string }> {
  if (!user || !user._id) {
    throw new UnauthorizedException('User not found or unauthorized');
  }

  return { _id: user._id.toString(), username: user.username }; // Convert ObjectId to string
}


  @Put(':id') // PUT /api/users/:id
  @UseGuards(JwtAuthGuard) // Protect the route with JWT guard
  async updateUser(
    @Param('id') id: string,
    @Body() updates: UpdateUserRequest,
  ) {
    return await this.usersService.updateUser(id, updates);
  }


}
