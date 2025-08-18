import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

export const GetMyPsychologistsSwaggerDoc = () =>
  applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Obtener los psicólogos del paciente autenticado',
    }),
    ApiResponse({
      status: 200,
      description: 'Lista de psicólogos recuperada exitosamente',
    }),
    ApiResponse({ status: 401, description: 'Token faltante o inválido' }),
    ApiResponse({
      status: 404,
      description: 'Este paciente aún no tiene psicólogos asignados',
    }),
    ApiResponse({
      status: 500,
      description: 'Error interno del servidor',
    }),
    ApiQuery({ name: 'page', required: false, type: Number }),
    ApiQuery({ name: 'limit', required: false, type: Number }),
  );
