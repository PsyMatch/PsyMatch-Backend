import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

export const GetMyDataSwaggerDoc = () =>
  applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Obtener la información del paciente autenticado',
    }),
    ApiResponse({
      status: 200,
      description: 'Información del paciente recuperada exitosamente',
    }),
    ApiResponse({ status: 401, description: 'Token faltante o inválido' }),
    ApiResponse({
      status: 404,
      description: 'Paciente no encontrado',
    }),
    ApiResponse({
      status: 500,
      description: 'Error interno del servidor',
    }),
  );
