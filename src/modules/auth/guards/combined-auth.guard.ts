import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

interface UserData {
  id: string;
  email: string;
  role: string;
}

interface ExtendedRequest
  extends Request<ParamsDictionary, unknown, unknown, ParsedQs> {
  route: {
    path: string;
  };
  user?: UserData;
}

@Injectable()
export class CombinedAuthGuard extends AuthGuard(['jwt', 'google']) {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<ExtendedRequest>();
    const authHeader = request.headers.authorization;

    const path = request.route?.path || request.path;
    const isGoogleAuthEndpoint =
      path === '/auth/google' || path === '/auth/google/callback';

    if (isGoogleAuthEndpoint) {
      return super.canActivate(context);
    }

    if (!authHeader) {
      throw new UnauthorizedException(
        'No se proporcionó un token de autenticación',
      );
    }

    if (authHeader.startsWith('Bearer ')) {
      return super.canActivate(context);
    }

    throw new UnauthorizedException('Metodo de autenticacion no valido');
  }

  handleRequest<T extends UserData>(
    err: Error | null,
    user: T | false,
    info: unknown,
    context: ExecutionContext,
  ): T {
    if (err || !user) {
      throw err || new UnauthorizedException('Acceso no autorizado');
    }

    const request = context.switchToHttp().getRequest<ExtendedRequest>();
    request.user = user;

    return user;
  }
}
