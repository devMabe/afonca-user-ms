import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      // Si la ruta no tiene roles específicos definidos, se permite el acceso
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.claims.roles) {
      // Si el usuario no está autenticado o no tiene roles, se deniega el acceso
      throw new ForbiddenException('Acceso denegado');
    }

    // Verificar si el usuario tiene al menos uno de los roles requeridos
    const allowed = roles.some((role) => user.claims.roles.includes(role));

    if (!allowed) {
      throw new ForbiddenException('Acceso denegado');
    }

    return true;
  }
}
