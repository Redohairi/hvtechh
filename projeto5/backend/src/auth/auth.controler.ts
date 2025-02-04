import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './ local-auth.guard'; // ou crie um local-auth.guard.ts
import { UsersService } from '../users/user.service';
import { UserRole } from 'src/users/schemas/user.schema';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  // Rota para registrar usuário
  @Post('register')
  async registerUser(
    @Body() body: { username: string; password: string; role?: UserRole },
  ) {
    const { username, password, role } = body;
    return this.usersService.createUser(username, password, role);
  }

  // Rota para login
  @UseGuards(LocalAuthGuard) // Usa local.strategy.ts
  @Post('login')
  async login(@Request() req) {
    // Se passou pelo guard, req.user está populado
    return this.authService.login(req.user);
  }
}
