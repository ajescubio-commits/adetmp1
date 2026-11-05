
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('register')
  async register(
    @Body()
    body: {
      username: string;
      password: string;
      first_name: string;
      last_name: string;
      course: string;
      year_level: number;
      phone: string;
    },
  ) {
    return this.usersService.createUser(
      body.username,
      body.password,
      'user',
      body.first_name,
      body.last_name,
      body.course,
      body.year_level,
      body.phone,
    );
  }

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const user = await this.authService.validateUser(
      body.username,
      body.password,
    );

    if (!user) return { error: 'Invalid credentials' };

    return this.authService.login(user);
  }

  @Post('logout')
  async logout(@Body() body: { userId: number }) {
    return this.authService.logout(body.userId);
  }

  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refreshTokens(body.refreshToken);
  }
}
