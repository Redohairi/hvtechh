import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // Valida o usuário (chamado pela LocalStrategy)
  async validateUser(username: string, pass: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }
    const isPasswordValid = await this.usersService.validatePassword(user, pass);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Senha inválida');
    }
    return user;
  }

  // Gera token JWT
  async login(user: any) {
    const payload = {
      username: user.username,
      sub: user._id,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
