import { Controller, Post, UseGuards, Request, Body, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard'; // ou crie um local-auth.guard.ts
import { UsersService } from '../users/user.service';
import { UserRole } from 'src/users/schemas/user.schema';
import { HttpCode } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  // Rota para registrar usuário
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async registerUser(
    @Body() body: { username: string; password: string; role?: UserRole },
  ) {
    const { username, password, role } = body;
    return this.usersService.createUser(username, password, role);
  }

  // Rota para login
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(LocalAuthGuard) 
  @Post('login')
  async login(@Request() req) {

    return this.authService.login(req.user);
  }
}
