import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { decodeJwt } from 'src/utils/security';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      // Si la ruta no tiene roles específicos definidos, se permite el acceso
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const auth = request.headers.authorization
    const token = auth.split(" ").pop()
    const userDecode = decodeJwt(token) as any;

    if (!userDecode || !userDecode.claims.roles) {
      // Si el usuario no está autenticado o no tiene roles, se deniega el acceso
      throw new ForbiddenException('Acceso denegado');
    }


    // Verificar si el usuario tiene al menos uno de los roles requeridos
    const allowed = roles.some((role) => userDecode.claims.roles.includes(role));

    if (!allowed) {
      throw new ForbiddenException('Acceso denegado');
    }

    return true;
  }
}
