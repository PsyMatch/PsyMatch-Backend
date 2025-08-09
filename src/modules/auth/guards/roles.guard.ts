import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { IAuthRequest } from '../interfaces/auth-request.interface';
import { ERole } from '../../../common/enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<IAuthRequest>();
    const user = request.user;

    const requiredRoles = this.reflector.getAllAndOverride<ERole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const hasRoleAdmin = user.role ? requiredRoles.includes(user.role) : false;

    const valid = user && user.role && hasRoleAdmin;

    if (!valid) {
      throw new ForbiddenException(
        "You don't have permission to access this route",
      );
    }

    return true;
  }
}
