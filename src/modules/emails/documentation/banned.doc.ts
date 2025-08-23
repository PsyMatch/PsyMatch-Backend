import { applyDecorators } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';

export const SendBannedEmailSwaggerDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Enviar correo electrónico de aviso de baneo',
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
