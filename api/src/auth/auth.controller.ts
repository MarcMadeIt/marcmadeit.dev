import { Controller, Post, Res, UnauthorizedException, UseGuards, Req } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { User } from 'src/users/schema/users.schema';
import { CurrentUser } from './current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

    @Post('login')
    @UseGuards(LocalAuthGuard)
    async login(
    @CurrentUser() user: User, // `user` bliver udtrukket af LocalAuthGuard
    @Res({ passthrough: true }) response: Response,
    ) {
    if (!user) {
        throw new UnauthorizedException('User is not authenticated');
    }

    const loginResponse = await this.authService.login(user, response);
    console.log('Login Response:', loginResponse);
    return loginResponse;
    }


    @Post('refresh')
    @UseGuards(JwtRefreshAuthGuard)
    async refreshToken(
    @Req() req: Request & { user: User },
    @Res({ passthrough: true }) response: Response,
    ) {
    const user = req.user;

    if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
    }

    const { accessToken } = await this.authService.refreshTokens(user, response);
    return { accessToken };
    }

}
