import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

export const GetMyPaymentsSwaggerDoc = () =>
  applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Obtener los pagos del paciente autenticado',
    }),
    ApiResponse({
      status: 200,
      description: 'Lista de pagos del paciente recuperada exitosamente',
    }),
    ApiResponse({ status: 401, description: 'Token faltante o inválido' }),
    ApiResponse({
      status: 404,
      description: 'Este paciente aún no tiene pagos registrados',
    }),
    ApiResponse({
      status: 500,
      description: 'Error interno del servidor',
    }),
    ApiQuery({ name: 'page', required: false, type: Number }),
    ApiQuery({ name: 'limit', required: false, type: Number }),
  );
