import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

export const FindAllSwaggerDoc = () =>
  applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Obtener todos los usuarios de la app (Solo administradores)',
    }),
    ApiResponse({
      status: 200,
      description: 'Lista de usuarios recuperada exitosamente',
    }),
    ApiResponse({ status: 401, description: 'Token faltante o inválido' }),
    ApiResponse({
      status: 403,
      description: 'No tienes permiso para acceder a esta ruta',
    }),
    ApiResponse({
      status: 404,
      description: 'No se encontraron usuarios activos',
    }),
    ApiResponse({
      status: 500,
      description: 'Error interno del servidor',
    }),
    ApiQuery({ name: 'page', required: false, type: Number }),
    ApiQuery({ name: 'limit', required: false, type: Number }),
  );

export const FindAllPatientsSwaggerDoc = () =>
  applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Obtener todos los pacientes de la app (Solo administradores)',
    }),
    ApiResponse({
      status: 200,
      description: 'Lista de pacientes recuperada exitosamente',
    }),
    ApiResponse({ status: 401, description: 'Token faltante o inválido' }),
    ApiResponse({
      status: 403,
      description: 'No tienes permiso para acceder a esta ruta',
    }),
    ApiResponse({
      status: 404,
      description: 'No se encontraron pacientes activos',
    }),
    ApiResponse({
      status: 500,
      description: 'Error interno del servidor',
    }),
    ApiQuery({ name: 'page', required: false, type: Number }),
    ApiQuery({ name: 'limit', required: false, type: Number }),
  );

export const FindAllPsychologistsSwaggerDoc = () =>
  applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Obtener todos los psicólogos de la app (Solo administradores)',
    }),
    ApiResponse({
      status: 200,
      description: 'Lista de psicólogos recuperada exitosamente',
    }),
    ApiResponse({ status: 401, description: 'Token faltante o inválido' }),
    ApiResponse({
      status: 403,
      description: 'No tienes permiso para acceder a esta ruta',
    }),
    ApiResponse({
      status: 404,
      description: 'No se encontraron usuarios activos',
    }),
    ApiResponse({
      status: 500,
      description: 'Error interno del servidor',
    }),
    ApiQuery({ name: 'page', required: false, type: Number }),
    ApiQuery({ name: 'limit', required: false, type: Number }),
  );
