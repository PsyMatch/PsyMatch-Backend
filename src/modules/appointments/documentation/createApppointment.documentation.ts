import { applyDecorators } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';

export const CreateAppointmentDocumentation = () =>
  applyDecorators(
    ApiOperation({ summary: 'Crear nueva cita (usuario autenticado)' }),
    ApiConsumes('application/x-www-form-urlencoded'),
    ApiResponse({
      status: 201,
      description: 'Cita creada exitosamente',
    }),
    ApiResponse({
      status: 403,
      description: 'No autorizado',
    }),
    ApiResponse({
      status: 404,
      description: 'Usuario o psicólogo no encontrado',
    }),
    ApiResponse({
      status: 400,
      description: 'Error de validación',
    }),
  );
