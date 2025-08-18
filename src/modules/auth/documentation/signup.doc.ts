import { applyDecorators } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';

export const SignUpSwaggerDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Registrar un nuevo paciente',
      description:
        'Registra un nuevo paciente. La foto de perfil se sube a Cloudinary si se proporciona.',
    }),
    ApiConsumes('multipart/form-data'),
    ApiResponse({
      status: 201,
      description: 'Paciente registrado exitosamente',
    }),
    ApiResponse({ status: 400, description: 'Datos de registro inválidos' }),
    ApiResponse({ status: 409, description: 'El paciente ya existe' }),
    ApiResponse({
      status: 500,
      description: 'Error interno del servidor',
    }),
  );
