import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

export const GetMyAppointmentsSwaggerDoc = () =>
  applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({ summary: 'Obtener las citas del paciente autenticado' }),
    ApiResponse({
      status: 200,
      description: 'Lista de las citas del paciente recuperadas exitosamente',
    }),
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
