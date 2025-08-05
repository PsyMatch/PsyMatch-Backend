import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const authHeader = request.headers['authorization'];

    if (!authHeader || typeof authHeader !== 'string') return false;

    const token = authHeader.split(' ')[1];

    if (!token) return false;

    try {
      const secret = process.env.JWT_SECRET;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const payload = this.jwtService.verify(token, { secret });

      const user = {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        id: payload.sub,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        email: payload.email,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        roles: payload.roles,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        iat: new Date(payload.iat * 1000),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        exp: new Date(payload.exp * 1000),
      };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      request.user = user;
      return true;
    } catch (error) {
      console.error('JWT verification failed:', error);
      return false;
    }
  }
}
