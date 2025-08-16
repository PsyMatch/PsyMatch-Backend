import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { IAuthRequest } from '../interfaces/auth-request.interface';
import { ERole } from '../../../common/enums/role.enum';

@Injectable()
export class SameUserOrAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<IAuthRequest>();
    const user = request.user;
    const param = request.params;

    if (!user) {
      throw new ForbiddenException('El usuario no está autenticado');
    }

    if (user.id !== param.id && user.role !== ERole.ADMIN) {
      throw new ForbiddenException(
        'No tienes permiso para acceder o modificar este recurso',
      );
    }

    return true;
  }
}
