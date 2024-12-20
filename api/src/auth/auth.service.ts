import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { Response } from 'express';
import { User } from 'src/users/schema/users.schema';
import { UsersService } from 'src/users/users.service';
import { TokenPayload } from './token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: User, response: Response) {
    if (!user) {
      throw new UnauthorizedException('User is not authenticated');
    }

    return this.refreshTokens(user, response);
  }

  async refreshTokens(user: User, response: Response): Promise<{ accessToken: string }> {
    const accessTokenExpirationMs = parseInt(
      this.configService.getOrThrow<string>('JWT_ACCESS_TOKEN_EXPIRATION_MS'),
    );
    const refreshTokenExpirationMs = parseInt(
      this.configService.getOrThrow<string>('JWT_REFRESH_TOKEN_EXPIRATION_MS'),
    );

    const tokenPayload: TokenPayload = {
      userId: user._id.toHexString(),
    };

    // Generate new tokens
    const accessToken = this.jwtService.sign(tokenPayload, {
      secret: this.configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${accessTokenExpirationMs}ms`,
    });

    const refreshToken = this.jwtService.sign(tokenPayload, {
      secret: this.configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${refreshTokenExpirationMs}ms`,
    });

    // // Hash and update the refresh token in the database
    // await this.userService.updateUser(
    //   { _id: user._id },
    //   { $set: { refreshToken: await hash(refreshToken, 10) } },
    // );

    

    // Set cookies
    response.cookie('Authentication', accessToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      maxAge: accessTokenExpirationMs,
    });

    response.cookie('Refresh', refreshToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      maxAge: refreshTokenExpirationMs,
    });

    return { accessToken };
  }

  async verifyUser(username: string, password: string): Promise<User> {
    const user = await this.userService.getUser({ username });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }


  

  async verifyUserRefreshToken(refreshToken: string, userId: string): Promise<User> {
    try {
      const user = await this.userService.getUser({ _id: userId });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const isTokenValid = await compare(refreshToken, user.refreshToken);
      if (!isTokenValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException('Refresh token is not valid');
    }
  }
}
