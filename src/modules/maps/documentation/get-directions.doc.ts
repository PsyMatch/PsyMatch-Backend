import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

export const GetDirectionsSwaggerDoc = () =>
  applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Obtener direcciones entre el paciente y el psicólogo',
    }),
    ApiConsumes('application/x-www-form-urlencoded'),
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
