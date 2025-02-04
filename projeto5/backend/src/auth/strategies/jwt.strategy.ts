import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'SECRET_JWT_KEY', // use .env
    });
  }

  async validate(payload: any) {
    // Retorna o payload decodificado (sub, username, role, etc.)
    // Fica disponível no request.user
    return {
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}
