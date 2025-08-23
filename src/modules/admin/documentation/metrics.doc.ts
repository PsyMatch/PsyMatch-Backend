import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

export const GetMetricsSwaggerDoc = () =>
  applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Obtener métricas del panel de administración',
    }),
    ApiResponse({ status: 401, description: 'Token inválido o expirado' }),
    ApiResponse({
      status: 404,
      description: 'No se encontró el usuario con ese ID',
    }),
    ApiResponse({
      status: 500,
      description: 'Error interno del servidor',
    }),
  );
