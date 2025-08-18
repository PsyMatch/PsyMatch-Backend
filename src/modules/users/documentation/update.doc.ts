import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

export const UpdateSwaggerDoc = () =>
  applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({ summary: 'Actualizar usuario por ID' }),
    ApiConsumes('multipart/form-data'),
    ApiResponse({
      status: 200,
      description: 'Usuario actualizado exitosamente',
    }),
    ApiResponse({ status: 400, description: 'Datos de entrada inválidos' }),
    ApiResponse({ status: 401, description: 'Token inválido o expirado' }),
    ApiResponse({
      status: 403,
      description: 'No tienes permiso para acceder a esta ruta',
    }),
    ApiResponse({
      status: 404,
      description: 'No se encontró el usuario con ese ID',
    }),
    ApiResponse({
      status: 500,
      description: 'Error interno del servidor',
    }),
  );
