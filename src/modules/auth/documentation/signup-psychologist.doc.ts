import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiConsumes, ApiResponse } from '@nestjs/swagger';

export const SignUpPsychologistSwaggerDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Registrar nuevo psicólogo',
      description:
        'Registra un nuevo psicólogo con credenciales profesionales. La foto de perfil se sube a Cloudinary si se proporciona.',
    }),
    ApiConsumes('multipart/form-data'),
    ApiResponse({
      status: 201,
      description: 'Psicólogo registrado exitosamente',
    }),
    ApiResponse({ status: 400, description: 'Datos de registro inválidos' }),
    ApiResponse({ status: 409, description: 'El psicólogo ya existe' }),
    ApiResponse({
      status: 500,
      description: 'Error interno del servidor',
    }),
  );
