import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';
import { IAuthRequest } from '../interfaces/auth-request.interface';

@Injectable()
export class CombinedAuthGuard extends AuthGuard(['jwt', 'google']) {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    super();
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<IAuthRequest>();
    const authHeader = request.headers.authorization;

    const path = request.route?.path || request.path;
    const isGoogleAuthEndpoint =
      path === '/auth/google' || path === '/auth/google/callback';

    if (isGoogleAuthEndpoint) {
      return super.canActivate(context);
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token faltante o inválido');
    }

    const token = authHeader.split(' ')[1];

    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      const payload = this.jwtService.verify<IJwtPayload>(token, { secret });

      payload.iat = new Date().toLocaleString('es-AR', {
        timeZone: 'America/Argentina/Buenos_Aires',
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      payload.exp = new Date().toLocaleString('es-AR', {
        timeZone: 'America/Argentina/Buenos_Aires',
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      request.user = payload;
      request.tokenExpiresAt = payload.exp;

      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException(
          `El token expiró el ${error.expiredAt.toLocaleString('es-AR', {
            timeZone: 'America/Argentina/Buenos_Aires',
            weekday: 'long',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })}`,
        );
      }
      throw new UnauthorizedException('Token inválido');
    }
  }

  handleRequest<T extends IJwtPayload>(
    err: Error | null,
    user: T | false,
    _info: unknown,
    context: ExecutionContext,
  ): T {
    if (err || !user) {
      throw err || new UnauthorizedException('Acceso no autorizado');
    }

    const request = context.switchToHttp().getRequest<IAuthRequest>();
    request.user = user;

    return user;
  }
}
