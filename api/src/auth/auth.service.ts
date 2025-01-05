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
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  // Login method, generates and sets the access and refresh tokens
  async login(user: User, response: Response, redirect = false) {
    const expiresAccessToken = new Date();
    expiresAccessToken.setMilliseconds(
      expiresAccessToken.getTime() +
        parseInt(
          this.configService.getOrThrow<string>(
            'JWT_ACCESS_TOKEN_EXPIRATION_MS',
          ),
        ),
    );

    const expiresRefreshToken = new Date();
    expiresRefreshToken.setMilliseconds(
      expiresRefreshToken.getTime() +
        parseInt(
          this.configService.getOrThrow<string>(
            'JWT_REFRESH_TOKEN_EXPIRATION_MS',
          ),
        ),
    );

    const tokenPayload: TokenPayload = {
      userId: user._id.toHexString(),
    };

    // Generate access token
    const accessToken = this.jwtService.sign(tokenPayload, {
      secret: this.configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.getOrThrow(
        'JWT_ACCESS_TOKEN_EXPIRATION_MS',
      )}ms`,
    });

    // Generate refresh token
    const refreshToken = this.jwtService.sign(tokenPayload, {
      secret: this.configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.getOrThrow(
        'JWT_REFRESH_TOKEN_EXPIRATION_MS',
      )}ms`,
    });

    // Hash and store refresh token in the database
    await this.usersService.updateUser(
      { _id: user._id },
      { $set: { refreshToken: await hash(refreshToken, 10) } },
    );

    // Set the access token in a cookie
    response.cookie('Authentication', accessToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      expires: expiresAccessToken,
    });

    // Set the refresh token in a cookie
    response.cookie('Refresh', refreshToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      expires: expiresRefreshToken,
    });

    if (redirect) {
      response.redirect(this.configService.getOrThrow('AUTH_UI_REDIRECT'));
    }
  }

  // Verify user credentials (for login)
  async verifyUser(username: string, password: string) {
    try {
      const user = await this.usersService.getUser({
        username,
      });
      const authenticated = await compare(password, user.password);
      if (!authenticated) {
        throw new UnauthorizedException();
      }
      return user;
    } catch (err) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
  }

  // Verify refresh token validity
  async veryifyUserRefreshToken(refreshToken: string, userId: string) {
    try {
      const user = await this.usersService.getUser({ _id: userId });
      const authenticated = await compare(refreshToken, user.refreshToken);
      if (!authenticated) {
        throw new UnauthorizedException();
      }
      return user;
    } catch (err) {
      throw new UnauthorizedException('Refresh token is not valid.');
    }
  }

  // Refresh the access token using a valid refresh token
  async refreshToken(refreshToken: string, response: Response) {
    try {
      // Verifying the refresh token
      const decoded = this.jwtService.verify(refreshToken, {
        secret: this.configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET'),
      });

      // Find the user based on the decoded userId
      const user = await this.usersService.getUser({ _id: decoded.userId });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Generate a new access token
      const tokenPayload: TokenPayload = { userId: user._id.toHexString() };
      const accessToken = this.jwtService.sign(tokenPayload, {
        secret: this.configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: `${this.configService.getOrThrow('JWT_ACCESS_TOKEN_EXPIRATION_MS')}ms`,
      });

      // Calculate the expiration date of the access token
      const expiresAccessToken = new Date();
      expiresAccessToken.setMilliseconds(
        expiresAccessToken.getTime() +
          parseInt(this.configService.getOrThrow<string>('JWT_ACCESS_TOKEN_EXPIRATION_MS')),
      );

      // Set the new access token as a cookie
      response.cookie('Authentication', accessToken, {
        httpOnly: true,
        secure: this.configService.get('NODE_ENV') === 'production', // Set the secure flag for production
        expires: expiresAccessToken,
      });

      return { accessToken }; // Return the new access token
    } catch (error) {
      // If the refresh token is invalid or expired
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  // Get the current user based on the token provided
  async getCurrentUserFromToken(token: string): Promise<User> {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.usersService.getUser({ _id: decoded.userId });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async logout(userId: string | undefined, response: Response) {
    // Fjern cookies uanset om vi har et userId eller ej
    response.cookie('Authentication', '', {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      expires: new Date(0),
    });
  
    response.cookie('Refresh', '', {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      expires: new Date(0),
    });
  
    if (!userId) {
      // Hvis vi ikke har et userId, fx. hvis token var udløbet/ugyldig
      // så kan vi stadig returnere 200 for at signalere at brugeren er "logget ud"
      response.status(200).json({ message: 'No user to log out, but cookies cleared' });
      return;
    }
  
    try {
      // Hvis vi har et userId, fjern refreshToken i DB
      await this.usersService.updateUser(
        { _id: userId },
        { $unset: { refreshToken: '' } },
      );
  
      response.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
      throw new UnauthorizedException('Logout failed');
    }
  }
  
}  