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

interface LoginBody {
  email?: string;
}

interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string; email: string };
  body: LoginBody;
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
    const body = request.body;
    const user = request.user;
    const now = Date.now();

    if (this.shouldIgnoreRequest(url)) {
      return next.handle();
    }

    this.logger.log(
      `→ ${method} ${url} - User: ${user?.id || 'Anonymous'} - IP: ${request.ip}`,
    );

    return next.handle().pipe(
      tap({
        next: (_responseBody) => {
          const statusCode = response.statusCode;
          const responseTime = Date.now() - now;

          this.logger.log(
            `← ${method} ${url} - ${statusCode} - ${responseTime}ms - User: ${user?.id || 'Anonymous'}`,
          );

          if (method === 'POST' && url?.includes('signin')) {
            const maskedEmail = this.maskEmail(body?.email);
            this.logger.log(
              `🔐 Login attempt - User: ${maskedEmail || 'Unknown'} - Status: ${statusCode}`,
            );
          }

          if (method === 'POST' && url?.includes('signup')) {
            const maskedEmail = this.maskEmail(body?.email);
            this.logger.log(
              `👤 Registration attempt - Email: ${maskedEmail || 'Unknown'} - Status: ${statusCode}`,
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
