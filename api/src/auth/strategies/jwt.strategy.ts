import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '../token-payload.interface';
import { UsersService } from 'src/users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // Første extractor forsøger at hente tokenet fra cookies
        (request: Request) => {
          const token = request.cookies?.Authentication;
          console.log("Extracted token from cookie:", token);
          return token; // Returner tokenet
        },
        // Hvis token ikke er fundet i cookies, prøver vi i Authorization header
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET'), // Hent JWT secret fra config
    });
  }

  // Validér JWT payload og returnér brugeren
  async validate(payload: TokenPayload) {
    console.log("Validating token payload:", payload);

    // Hvis payload ikke har userId, er tokenet ugyldigt
    if (!payload?.userId) {
      console.error("Invalid payload, missing userId");
      throw new UnauthorizedException("Invalid token payload");
    }

    // Find brugeren i databasen
    const user = await this.usersService.getUser({ _id: payload.userId });
    if (!user) {
      console.error("User not found for payload:", payload);
      throw new UnauthorizedException("User not found");
    }

    console.log("User validated:", user);
    return user; // Returner brugeren, så den kan bruges i controlleren
  }
}
