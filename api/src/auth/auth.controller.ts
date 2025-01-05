import { Controller, Get, Post, Request, Res, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { User } from 'src/users/schema/users.schema';
import { CurrentUser } from './current-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(user, response);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  async refreshToken(
  @CurrentUser() user: User, 
  @Res({ passthrough: true }) response: Response,
  ) {
    if (!user) {
      response.status(401).json({ message: 'Invalid or expired refresh token' });
      return;
    }

    await this.authService.refreshToken(user.refreshToken, response);
  }

  @UseGuards(JwtAuthGuard) 
  @Get('me')
  getCurrentUser(@CurrentUser() user: User) {
    return user; 
  }

  
  
  
  
  @Post('logout')
    async logout(
    @CurrentUser() user: User,
  @Res({ passthrough: true }) response: Response,
  ) {
  await this.authService.logout(user?._id?.toHexString(), response); 
}
}
