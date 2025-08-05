import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance, ClassConstructor } from 'class-transformer';
import { Reflector } from '@nestjs/core';
import { RESPONSE_TYPE_KEY } from '../decorators/response-type.decorator';

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((data: unknown) => {
        // Obtener el tipo de respuesta del decorador de metadatos
        const responseType = this.reflector.get<ClassConstructor<unknown>>(
          RESPONSE_TYPE_KEY,
          context.getHandler(),
        );

        if (responseType && data) {
          // Si hay un tipo específico, transformar los datos
          return this.transformData(data, responseType);
        }

        return data;
      }),
    );
  }

  private transformData(
    data: unknown,
    responseType: ClassConstructor<unknown>,
  ): unknown {
    // Si es un objeto con estructura de respuesta API
    if (data && typeof data === 'object' && 'data' in data) {
      const responseData = data as { data: unknown; [key: string]: unknown };
      return {
        ...responseData,
        data: plainToInstance(responseType, responseData.data, {
          excludeExtraneousValues: true,
        }),
      };
    }

    // Si es un array
    if (Array.isArray(data)) {
      return plainToInstance(responseType, data, {
        excludeExtraneousValues: true,
      });
    }

    // Si es un objeto simple
    return plainToInstance(responseType, data, {
      excludeExtraneousValues: true,
    });
  }
}
