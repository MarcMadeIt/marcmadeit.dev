import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User } from 'src/users/schema/users.schema';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'username' }); // Brug "username" som felt
  }

  async validate(username: string, password: string): Promise<User> {
    const user = await this.authService.verifyUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user; // Dette bliver til `request.user`
  }
}
