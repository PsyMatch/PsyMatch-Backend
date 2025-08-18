import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

export const FindAllPatientsSwaggerDoc = () =>
  applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Obtener todos los pacientes de la app (Solo administradores)',
    }),
    ApiResponse({
      status: 200,
      description: 'Lista de pacientes recuperada exitosamente',
    }),
    ApiResponse({ status: 401, description: 'Token faltante o inválido' }),
    ApiResponse({
      status: 403,
      description: 'No tienes permiso para acceder a esta ruta',
    }),
    ApiResponse({
      status: 404,
      description: 'No se encontraron pacientes activos',
    }),
    ApiResponse({
      status: 500,
      description: 'Error interno del servidor',
    }),
    ApiQuery({ name: 'page', required: false, type: Number }),
    ApiQuery({ name: 'limit', required: false, type: Number }),
  );
