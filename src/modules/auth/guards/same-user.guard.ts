import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { IAuthRequest } from '../interfaces/auth-request.interface';
import { ERole } from '../../users/enums/role.enum';
import { validate as isUuid } from 'uuid';

@Injectable()
export class SameUserOrAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<IAuthRequest>();
    const user = request.user;
    const paramId = request.params.id;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (user.role === ERole.ADMIN) return true;

    if (!isUuid(paramId)) {
      throw new BadRequestException('Validation failed (uuid is expected)');
    }

    if (user.id !== paramId) {
      throw new ForbiddenException(
        'You are not allowed to access or modify this resource',
      );
    }

    return true;
  }
}
