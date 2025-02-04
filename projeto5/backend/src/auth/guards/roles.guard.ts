import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { ROLES_KEY } from '../decorators/roles.decorator';
  import { UserRole } from 'src/users/schemas/user.schema';
  
  @Injectable()
  export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
  
    canActivate(context: ExecutionContext): boolean {
      const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      if (!requiredRoles || requiredRoles.length === 0) {
        // se a rota não tiver roles, libera o acesso
        return true;
      }
  
      const { user } = context.switchToHttp().getRequest();
      // user.role vem do payload do JWT
      if (!user?.role) {
        throw new ForbiddenException('Usuário sem role definida');
      }
  
      if (!requiredRoles.includes(user.role)) {
        throw new ForbiddenException(`Acesso negado: Role necessária: ${requiredRoles}`);
      }
  
      return true;
    }
  }
  