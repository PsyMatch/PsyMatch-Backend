import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

interface AuthResponse {
  data?: {
    id?: string;
  };
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  private readonly ignoredPaths = ['/favicon.ico', '/health', '/metrics'];

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const response = context.switchToHttp().getResponse<Response>();

    const method = request.method;
    const url = request.url;
    const now = Date.now();
    let ip = request.ip;
    if (ip === '::1') ip = '127.0.0.1';

    if (this.shouldIgnoreRequest(url)) {
      return next.handle();
    }

    this.logger.log(`→ ${method} ${url} - IP: ${ip}`);

    return next.handle().pipe(
      tap({
        next: (responseBody) => {
          const statusCode = response.statusCode;
          const responseTime = Date.now() - now;

          this.logger.log(
            `← ${method} ${url} - ${statusCode} - ${responseTime}ms`,
          );

          if (method === 'POST' && url?.includes('signin')) {
            const userId =
              (responseBody as AuthResponse)?.data?.id || 'Unknown';
            this.logger.log(
              `🔐 Login attempt - User: ${userId} - Status: ${statusCode}`,
            );
          }

          if (method === 'POST' && url?.includes('signup')) {
            const userId =
              (responseBody as AuthResponse)?.data?.id || 'Unknown';
            this.logger.log(
              `👤 Registration attempt - User: ${userId} - Status: ${statusCode}`,
            );
          }
        },
        error: (error: Error) => {
          const responseTime = Date.now() - now;
          this.logger.error(
            `💥 Error Response - ${method} ${url} - ${responseTime}ms - Error: ${error.message}`,
          );
        },
      }),
    );
  }

  private shouldIgnoreRequest(url: string): boolean {
    return this.ignoredPaths.some((path) => url.includes(path));
  }

  private maskEmail(email?: string): string {
    if (!email || typeof email !== 'string') return 'Unknown';

    const [localPart, domain] = email.split('@');
    if (!domain) return '***';

    const maskedLocal =
      localPart.length > 2 ? localPart.substring(0, 2) + '***' : '***';

    return `${maskedLocal}@${domain}`;
  }
}
