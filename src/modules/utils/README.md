# Módulo de Utilidades (Utils)

## Descripción General

El módulo de **Utils** es el núcleo de servicios utilitarios y helpers de PsyMatch-Backend. Proporciona funcionalidades transversales que son utilizadas por todos los demás módulos del sistema, incluyendo gestión de transacciones de base de datos, validaciones personalizadas, logging automático, y herramientas de desarrollo.

## Funcionalidades Principales

### 🔄 Gestión de Transacciones

- **QueryHelper**: Manejo automático de transacciones de base de datos
- **Rollback automático**: En caso de errores durante operaciones complejas
- **Connection pooling**: Gestión eficiente de conexiones a PostgreSQL

### 🔐 Validaciones Personalizadas

- **MatchPasswordHelper**: Validador para confirmación de contraseñas
- **Validaciones complejas**: Soporte para validaciones que requieren múltiples campos
- **Mensajes personalizados**: Respuestas de error claras y útiles

### 📊 Servicios Comunes

- **PaginationService**: Paginación automática para endpoints con listas
- **Logging inteligente**: Interceptor que registra todas las operaciones HTTP
- **Transformación de respuestas**: Interceptor para formateo automático de DTOs

### 🛠️ Herramientas de Desarrollo

- **Fix-imports script**: Automatización para actualizar imports relativos
- **Interceptores globales**: Funcionalidad que se aplica a toda la aplicación
- **Helpers reutilizables**: Funciones comunes para todos los módulos

## Arquitectura del Módulo

### 📁 Estructura de Archivos

```
utils/
├── utils.module.ts                    # Módulo global de utilidades
├── helpers/
│   ├── query.helper.ts                # Gestor de transacciones de BD
│   └── matchPassword.helper.ts        # Validador de confirmación de contraseñas
└── scripts/
    └── fix-imports.script.ts          # Script para arreglar imports relativos
```

│ └── transform-response.interceptor.ts # Transformador de respuestas
├── decorators/
│ └── response-type.decorator.ts # Decorador para tipado de respuestas
└── dto/
└── pagination.dto.ts # DTOs para paginación

````

## Servicios y Helpers

### 🔄 QueryHelper - Gestión de Transacciones

El `QueryHelper` proporciona una interfaz simplificada para manejar transacciones de base de datos de forma segura y consistente.

#### Funcionalidades

```typescript
import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';

@Injectable()
export class QueryHelper {
  constructor(private readonly dataSource: DataSource) {}

  async runInTransaction<T>(
    callback: (queryRunner: QueryRunner) => Promise<T>,
  ): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await callback(queryRunner);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
````

#### Ejemplo de Uso en Servicios

```typescript
// En cualquier servicio (ejemplo: users.service.ts)
import { QueryHelper } from '../utils/helpers/query.helper';

@Injectable()
export class UsersService {
  constructor(
    private readonly queryHelper: QueryHelper,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async updateUserWithProfile(
    userId: string,
    userData: any,
    profileData: any,
  ): Promise<string> {
    return this.queryHelper.runInTransaction(async (queryRunner) => {
      const userRepo = queryRunner.manager.getRepository(User);
      const profileRepo = queryRunner.manager.getRepository(Profile);

      // Actualizar usuario
      const user = await userRepo.findOneBy({ id: userId });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      Object.assign(user, userData);
      await userRepo.save(user);

      // Actualizar perfil (si falla, todo se revierte)
      const profile = await profileRepo.findOneBy({ userId });
      if (profile) {
        Object.assign(profile, profileData);
        await profileRepo.save(profile);
      }

      return user.id;
    });
  }
}
```

### 🔐 MatchPasswordHelper - Validación de Contraseñas

El `MatchPasswordHelper` es un validador personalizado para verificar que dos campos de contraseña coincidan.

#### Implementación

```typescript
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'MatchPassword', async: false })
export class MatchPasswordHelper implements ValidatorConstraintInterface {
  validate(password: string, args: ValidationArguments) {
    const object = args.object as Record<string, unknown>;
    const propertyToMatch = args.constraints[0] as string;
    if (password !== object[propertyToMatch]) return false;
    return true;
  }

  defaultMessage() {
    return 'Las contraseñas no coinciden';
  }
}
```

#### Uso en DTOs

```typescript
// dto/change-password.dto.ts
import { IsString, MinLength, Validate } from 'class-validator';
import { MatchPasswordHelper } from '../utils/helpers/matchPassword.helper';

export class ChangePasswordDto {
  @IsString({ message: 'La contraseña actual debe ser un string' })
  currentPassword: string;

  @IsString({ message: 'La nueva contraseña debe ser un string' })
  @MinLength(6, {
    message: 'La nueva contraseña debe tener al menos 6 caracteres',
  })
  newPassword: string;

  @IsString({ message: 'La confirmación debe ser un string' })
  @Validate(MatchPasswordHelper, ['newPassword'], {
    message: 'La confirmación de contraseña no coincide',
  })
  confirmPassword: string;
}
```

### 📊 PaginationService - Servicio de Paginación

El `PaginationService` proporciona paginación automática y consistente para todos los endpoints que manejan listas.

#### Implementación

```typescript
import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder, ObjectLiteral } from 'typeorm';

export interface PaginationDto {
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

@Injectable()
export class PaginationService {
  async paginate<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<T>> {
    const { page = 1, limit = 10 } = paginationDto;
    const offset = (page - 1) * limit;

    queryBuilder.limit(limit).offset(offset);

    const [data, total] = await queryBuilder.getManyAndCount();

    const meta: PaginationMeta = {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrevious: page > 1,
    };

    return { data, meta };
  }

  createMeta(total: number, page: number, limit: number): PaginationMeta {
    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrevious: page > 1,
    };
  }
}
```

#### Ejemplo de Uso

```typescript
// En cualquier servicio
import { PaginationService } from '../../common/services/pagination.service';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly paginationService: PaginationService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async findAll(paginationDto: PaginationDto) {
    const queryBuilder = this.userRepo
      .createQueryBuilder('user')
      .where('user.is_active = :isActive', { isActive: true })
      .orderBy('user.created_at', 'DESC');

    return await this.paginationService.paginate(queryBuilder, paginationDto);
  }
}
```

### 📝 LoggingInterceptor - Interceptor de Logging

El `LoggingInterceptor` registra automáticamente todas las peticiones HTTP con información detallada.

#### Características

- **Logging automático**: Registra entrada y salida de todas las peticiones
- **Tiempo de respuesta**: Mide y registra el tiempo de procesamiento
- **Detección de autenticación**: Registra eventos especiales de login/registro
- **Filtrado inteligente**: Ignora rutas como `/favicon.ico`, `/health`
- **Manejo de errores**: Logs detallados para debugging

#### Implementación

```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');
  private readonly ignoredPaths = ['/favicon.ico', '/health', '/metrics'];

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const method = request.method;
    const url = request.url;
    const now = Date.now();

    if (this.shouldIgnoreRequest(url)) {
      return next.handle();
    }

    this.logger.log(`→ ${method} ${url} - IP: ${request.ip}`);

    return next.handle().pipe(
      tap({
        next: (responseBody) => {
          const statusCode = response.statusCode;
          const responseTime = Date.now() - now;

          this.logger.log(
            `← ${method} ${url} - ${statusCode} - ${responseTime}ms`,
          );

          // Logging especial para autenticación
          if (method === 'POST' && url?.includes('signin')) {
            const userId = responseBody?.data?.id || 'Unknown';
            this.logger.log(
              `🔐 Login attempt - User: ${userId} - Status: ${statusCode}`,
            );
          }

          if (method === 'POST' && url?.includes('signup')) {
            const userId = responseBody?.data?.id || 'Unknown';
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
}
```

#### Ejemplo de Logs

```bash
[HTTP] → GET /users - IP: 127.0.0.1
[HTTP] ← GET /users - 200 - 45ms

[HTTP] → POST /auth/signin - IP: 192.168.1.100
[HTTP] ← POST /auth/signin - 200 - 123ms
[HTTP] 🔐 Login attempt - User: user-uuid-123 - Status: 200

[HTTP] → PUT /users/invalid-id - IP: 127.0.0.1
[HTTP] 💥 Error Response - PUT /users/invalid-id - 67ms - Error: User not found
```

### 🔄 TransformResponseInterceptor - Transformador de Respuestas

Este interceptor aplica automáticamente transformaciones de DTOs a las respuestas de la API.

#### Implementación

```typescript
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

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((data: unknown) => {
        const responseType = this.reflector.get<ClassConstructor<unknown>>(
          'RESPONSE_TYPE_KEY',
          context.getHandler(),
        );

        if (responseType && data) {
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
    if (data && typeof data === 'object' && 'data' in data) {
      const responseData = data as { data: unknown; [key: string]: unknown };
      return {
        ...responseData,
        data: plainToInstance(responseType, responseData.data, {
          excludeExtraneousValues: true,
        }),
      };
    }

    if (Array.isArray(data)) {
      return plainToInstance(responseType, data, {
        excludeExtraneousValues: true,
      });
    }

    return plainToInstance(responseType, data, {
      excludeExtraneousValues: true,
    });
  }
}
```

#### Uso con Decorador

```typescript
// Decorador para especificar el tipo de respuesta
import { SetMetadata } from '@nestjs/common';

export const RESPONSE_TYPE_KEY = 'responseType';
export const ResponseType = (dto: any) => SetMetadata(RESPONSE_TYPE_KEY, dto);

// En el controlador
@Get(':id')
@ResponseType(UserResponseDto)
async findById(@Param('id') id: string) {
  return await this.usersService.findById(id);
}
```

## Scripts de Desarrollo

### 🛠️ Fix-Imports Script

Script automático para convertir imports absolutos a relativos, mejorando la portabilidad del código.

#### Implementación

```typescript
import { Project } from 'ts-morph';
import path from 'path';

async function fixImports() {
  try {
    const project = new Project({
      tsConfigFilePath: 'tsconfig.json',
    });

    const sourceFiles = project.getSourceFiles('src/**/*.ts');

    sourceFiles.forEach((sourceFile) => {
      const imports = sourceFile.getImportDeclarations();

      imports.forEach((imp) => {
        const moduleSpecifier = imp.getModuleSpecifierValue();

        // Convertir imports que empiecen con 'src/' a rutas relativas
        if (moduleSpecifier.startsWith('src/')) {
          const sourceFilePath = sourceFile.getFilePath();
          const absPath = path.resolve(process.cwd(), moduleSpecifier);

          const relPath = path
            .relative(path.dirname(sourceFilePath), absPath)
            .replace(/\\/g, '/');

          const finalPath = relPath.startsWith('.') ? relPath : './' + relPath;
          imp.setModuleSpecifier(finalPath);
        }
      });
    });

    await project.save();
    console.log('✅ Imports updated to relative paths');
  } catch (error) {
    console.error('❌ Error while updating imports:', error);
    process.exit(1);
  }
}

void fixImports();
```

#### Ejecución

```bash
# Instalar dependencias
npm install ts-morph --save-dev

# Ejecutar script
npx ts-node src/modules/utils/scripts/fix-imports.script.ts
```

## Integración con Frontend (Next.js)

### 🔧 Cliente de Utilidades

```typescript
// lib/api.ts - Cliente base para API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Método con paginación automática
  async getPaginated<T>(
    endpoint: string,
    token: string,
    page = 1,
    limit = 10,
    filters?: Record<string, any>,
  ): Promise<PaginatedResponse<T>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });

    const response = await fetch(`${this.baseURL}${endpoint}?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Método con manejo automático de errores
  async request<T>(
    endpoint: string,
    options: RequestInit = {},
    token?: string,
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `HTTP error! status: ${response.status}`,
      );
    }

    return response.json();
  }

  // Método para subida de archivos
  async uploadFile(
    endpoint: string,
    file: File,
    additionalData: Record<string, any> = {},
    token?: string,
  ): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);

    Object.keys(additionalData).forEach((key) => {
      formData.append(key, additionalData[key]);
    });

    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `HTTP error! status: ${response.status}`,
      );
    }

    return response.json();
  }
}

// Instancia singleton
export const apiClient = new ApiClient();

// Tipos TypeScript para paginación
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}
```

### 🎯 Hook de Paginación

```typescript
// hooks/usePagination.ts
import { useState, useEffect, useCallback } from 'react';
import { apiClient, PaginatedResponse } from '../lib/api';

interface UsePaginationProps {
  endpoint: string;
  token?: string;
  initialPage?: number;
  initialLimit?: number;
  dependencies?: any[];
}

export function usePagination<T>({
  endpoint,
  token,
  initialPage = 1,
  initialLimit = 10,
  dependencies = [],
}: UsePaginationProps) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  const fetchData = useCallback(
    async (page = currentPage) => {
      if (!token) return;

      try {
        setLoading(true);
        const response: PaginatedResponse<T> = await apiClient.getPaginated(
          endpoint,
          token,
          page,
          initialLimit,
        );

        setData(response.data);
        setCurrentPage(response.meta.page);
        setTotalPages(response.meta.totalPages);
        setTotal(response.meta.total);
        setHasNext(response.meta.hasNext);
        setHasPrevious(response.meta.hasPrevious);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [endpoint, token, initialLimit, currentPage],
  );

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
        fetchData(page);
      }
    },
    [totalPages, fetchData],
  );

  const nextPage = useCallback(() => {
    if (hasNext) {
      goToPage(currentPage + 1);
    }
  }, [hasNext, currentPage, goToPage]);

  const previousPage = useCallback(() => {
    if (hasPrevious) {
      goToPage(currentPage - 1);
    }
  }, [hasPrevious, currentPage, goToPage]);

  const refresh = useCallback(() => {
    fetchData(currentPage);
  }, [fetchData, currentPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  return {
    data,
    loading,
    error,
    currentPage,
    totalPages,
    total,
    hasNext,
    hasPrevious,
    goToPage,
    nextPage,
    previousPage,
    refresh,
  };
}
```

### 📋 Componente de Paginación Reutilizable

```typescript
// components/Pagination.tsx
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  onPageChange: (page: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  hasNext,
  hasPrevious,
  onPageChange,
  onNext,
  onPrevious,
  className = ''
}: PaginationProps) {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <nav className={`flex items-center justify-center space-x-2 ${className}`}>
      {/* Botón Anterior */}
      <button
        onClick={onPrevious}
        disabled={!hasPrevious}
        className={`px-3 py-2 rounded-md text-sm font-medium ${
          hasPrevious
            ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
        }`}
      >
        Anterior
      </button>

      {/* Números de página */}
      {getVisiblePages().map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className="px-3 py-2 text-gray-500">...</span>
          ) : (
            <button
              onClick={() => onPageChange(page as number)}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                currentPage === page
                  ? 'bg-blue-600 text-white border border-blue-600'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      {/* Botón Siguiente */}
      <button
        onClick={onNext}
        disabled={!hasNext}
        className={`px-3 py-2 rounded-md text-sm font-medium ${
          hasNext
            ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
        }`}
      >
        Siguiente
      </button>

      {/* Información de página */}
      <div className="ml-4 text-sm text-gray-700">
        Página {currentPage} de {totalPages}
      </div>
    </nav>
  );
}
```

### 🔄 Componente de Lista con Paginación

```typescript
// components/PaginatedList.tsx
'use client';

import { usePagination } from '../hooks/usePagination';
import Pagination from './Pagination';
import { useAuth } from '../context/AuthContext';

interface PaginatedListProps<T> {
  endpoint: string;
  renderItem: (item: T) => React.ReactNode;
  renderEmpty?: () => React.ReactNode;
  renderLoading?: () => React.ReactNode;
  renderError?: (error: string) => React.ReactNode;
  className?: string;
  limit?: number;
}

export default function PaginatedList<T>({
  endpoint,
  renderItem,
  renderEmpty,
  renderLoading,
  renderError,
  className = '',
  limit = 10
}: PaginatedListProps<T>) {
  const { user } = useAuth();
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

  const {
    data,
    loading,
    error,
    currentPage,
    totalPages,
    total,
    hasNext,
    hasPrevious,
    goToPage,
    nextPage,
    previousPage,
    refresh
  } = usePagination<T>({
    endpoint,
    token: token || undefined,
    initialLimit: limit,
    dependencies: [user]
  });

  if (loading) {
    return renderLoading ? renderLoading() : (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Cargando...</span>
      </div>
    );
  }

  if (error) {
    return renderError ? renderError(error) : (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">Error: {error}</div>
        <button
          onClick={refresh}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (data.length === 0) {
    return renderEmpty ? renderEmpty() : (
      <div className="text-center py-8 text-gray-500">
        <div className="text-lg mb-2">No hay elementos para mostrar</div>
        <div className="text-sm">Los elementos aparecerán aquí una vez que sean agregados</div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Información de resultados */}
      <div className="mb-4 text-sm text-gray-600">
        Mostrando {data.length} de {total} elementos
      </div>

      {/* Lista de elementos */}
      <div className="space-y-4 mb-6">
        {data.map((item, index) => (
          <div key={index}>
            {renderItem(item)}
          </div>
        ))}
      </div>

      {/* Paginación */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        hasNext={hasNext}
        hasPrevious={hasPrevious}
        onPageChange={goToPage}
        onNext={nextPage}
        onPrevious={previousPage}
        className="mt-6"
      />
    </div>
  );
}
```

## Validaciones Avanzadas

### 🔐 Validadores Personalizados

```typescript
// validators/custom-validators.ts
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

// Validador para fechas no futuras
@ValidatorConstraint({ name: 'isNotFutureDate', async: false })
export class IsNotFutureDateConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    if (!value) return true; // Permite valores nulos/undefined
    const date = new Date(value);
    return date <= new Date();
  }

  defaultMessage() {
    return 'La fecha no puede ser futura';
  }
}

export function IsNotFutureDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsNotFutureDateConstraint,
    });
  };
}

// Validador para DNI argentino
@ValidatorConstraint({ name: 'isValidArgentinianDNI', async: false })
export class IsValidArgentinianDNIConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any) {
    if (!value) return true; // Permite valores nulos/undefined

    // DNI debe ser un número entre 1.000.000 y 99.999.999
    const dni = Number(value);
    return !isNaN(dni) && dni >= 1000000 && dni <= 99999999;
  }

  defaultMessage() {
    return 'El DNI debe ser un número válido argentino (entre 1.000.000 y 99.999.999)';
  }
}

export function IsValidArgentinianDNI(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidArgentinianDNIConstraint,
    });
  };
}

// Validador para teléfonos argentinos
@ValidatorConstraint({ name: 'isValidArgentinianPhone', async: false })
export class IsValidArgentinianPhoneConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any) {
    if (!value) return true; // Permite valores nulos/undefined

    // Formato: +54 11 1234-5678 o +5411123456789 o 1123456789
    const phoneRegex =
      /^(\+54)?(\s*)?(11|[02-9]\d{1,3})(\s*)?(\d{3,4})(\s*)?(\d{4})$/;
    return phoneRegex.test(value);
  }

  defaultMessage() {
    return 'El teléfono debe ser un número argentino válido';
  }
}

export function IsValidArgentinianPhone(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidArgentinianPhoneConstraint,
    });
  };
}
```

## Herramientas de Debugging

### 🐛 Debug Helper

```typescript
// helpers/debug.helper.ts
import { Logger } from '@nestjs/common';

export class DebugHelper {
  private static logger = new Logger('Debug');

  static logQuery(query: string, parameters?: any[]) {
    if (process.env.NODE_ENV === 'development') {
      this.logger.debug('SQL Query:', query);
      if (parameters) {
        this.logger.debug('Parameters:', parameters);
      }
    }
  }

  static logPerformance<T>(
    operation: string,
    callback: () => Promise<T>,
  ): Promise<T> {
    return new Promise(async (resolve, reject) => {
      const start = Date.now();
      try {
        const result = await callback();
        const duration = Date.now() - start;

        if (process.env.NODE_ENV === 'development') {
          this.logger.debug(`⚡ ${operation} completed in ${duration}ms`);
        }

        resolve(result);
      } catch (error) {
        const duration = Date.now() - start;
        this.logger.error(`❌ ${operation} failed after ${duration}ms:`, error);
        reject(error);
      }
    });
  }

  static logMemoryUsage() {
    if (process.env.NODE_ENV === 'development') {
      const used = process.memoryUsage();
      this.logger.debug('Memory Usage:', {
        rss: `${Math.round((used.rss / 1024 / 1024) * 100) / 100} MB`,
        heapTotal: `${Math.round((used.heapTotal / 1024 / 1024) * 100) / 100} MB`,
        heapUsed: `${Math.round((used.heapUsed / 1024 / 1024) * 100) / 100} MB`,
        external: `${Math.round((used.external / 1024 / 1024) * 100) / 100} MB`,
      });
    }
  }
}
```

## Configuración Global

### ⚙️ Configuración del Módulo

```typescript
// utils.module.ts
import { Global, Module } from '@nestjs/common';
import { QueryHelper } from './helpers/query.helper';
import { MatchPasswordHelper } from './helpers/matchPassword.helper';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from '../../common/interceptors/logging.interceptor';
import { TransformResponseInterceptor } from '../../common/interceptors/transform-response.interceptor';
import { PaginationService } from '../../common/services/pagination.service';

@Global()
@Module({
  providers: [
    QueryHelper,
    MatchPasswordHelper,
    PaginationService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
  ],
  exports: [QueryHelper, MatchPasswordHelper, PaginationService],
})
export class UtilsModule {}
```

## Consideraciones de Producción

### 🚀 Optimizaciones

```typescript
// Configuración de performance para producción
const productionConfig = {
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    maxFileSize: '10MB',
    maxFiles: 5,
    enableConsole: process.env.NODE_ENV !== 'production',
  },
  pagination: {
    defaultLimit: 10,
    maxLimit: 100,
    enableCaching: true,
    cacheTimeout: 300, // 5 minutos
  },
  transactions: {
    timeout: 30000, // 30 segundos
    retryAttempts: 3,
    enableDeadlockDetection: true,
  },
};
```

### 📈 Métricas de Monitoreo

```typescript
const utilsMetrics = {
  transactionCount: 'Número total de transacciones ejecutadas',
  transactionFailures: 'Transacciones fallidas',
  averageTransactionTime: 'Tiempo promedio de transacciones',
  paginationRequests: 'Requests con paginación',
  loggingEvents: 'Eventos de logging registrados',
  validationErrors: 'Errores de validación personalizados',
};
```

## Próximas Mejoras

- [ ] Cache service para optimizar consultas frecuentes
- [ ] Rate limiting helper para protección de endpoints
- [ ] Batch operations helper para operaciones masivas
- [ ] Health check service para monitoreo del sistema
- [ ] Email service para notificaciones
- [ ] SMS service para verificaciones
- [ ] Background jobs helper para tareas asíncronas
- [ ] File compression helper para optimizar archivos
- [ ] Security helpers para validaciones avanzadas
- [ ] API versioning helper para compatibilidad
