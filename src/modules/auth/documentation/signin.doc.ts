import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiConsumes, ApiResponse } from '@nestjs/swagger';

export const SignInSwaggerDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Iniciar sesión y obtener JWT token',
      description:
        'Inicia sesión con las credenciales del paciente y obtiene un JWT token para acceder a rutas protegidas.',
    }),
    ApiConsumes('multipart/form-data'),
    ApiResponse({
      status: 201,
      description:
        'Inicio de sesión exitoso - JWT Token incluido en la respuesta. Copia el token para usar en rutas protegidas.',
    }),
    ApiResponse({ status: 400, description: 'Credenciales inválidas' }),
    ApiResponse({
      status: 401,
      description: 'Correo electrónico o contraseña incorrectos',
    }),
    ApiResponse({
      status: 429,
      description:
        'Demasiados intentos de inicio de sesión. Por favor, intenta más tarde.',
    }),
  );
