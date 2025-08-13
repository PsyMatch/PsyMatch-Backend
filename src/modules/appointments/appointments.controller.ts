import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiConsumes,
} from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@ApiTags('Citas')
@Controller('appointments')
@UseGuards(AuthGuard)
@ApiBearerAuth('JWT-auth')
export class AppointmentsController {
  constructor(private readonly service: AppointmentsService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear una nueva cita',
    description: 'Programa una nueva cita entre un paciente y un psicólogo',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        patient_id: { type: 'string', example: 'patient-uuid' },
        psychologist_id: { type: 'string', example: 'psychologist-uuid' },
        date: { type: 'string', example: '2024-03-15T10:00:00Z' },
        duration: { type: 'string', example: '60' },
        session_type: { type: 'string', example: 'individual' },
        notes: { type: 'string', example: 'Consulta inicial' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Cita creada exitosamente',
    schema: {
      type: 'object',
      properties: {
        appointment_id: { type: 'string', example: 'appointment-uuid' },
        date: {
          type: 'string',
          format: 'date-time',
          example: '2024-03-15T10:00:00Z',
        },
        duration: { type: 'number', example: 60 },
        status: { type: 'string', example: 'SCHEDULED' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'user-uuid' },
            name: { type: 'string', example: 'Juan Pérez' },
            email: { type: 'string', example: 'juan.perez@email.com' },
          },
        },
        psychologist: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'psychologist-uuid' },
            name: { type: 'string', example: 'Dr. Ana García' },
            email: { type: 'string', example: 'ana.garcia@psychologist.com' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos de cita inválidos' })
  @ApiResponse({ status: 401, description: 'Token inválido o expirado' })
  create(@Body() dto: CreateAppointmentDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las citas',
    description:
      'Recuperar todas las citas con detalles de usuario y psicólogo',
  })
  @ApiResponse({
    status: 200,
    description: 'Citas recuperadas exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          appointment_id: { type: 'string', example: 'appointment-uuid' },
          date: {
            type: 'string',
            format: 'date-time',
            example: '2024-03-15T10:00:00Z',
          },
          duration: { type: 'number', example: 60 },
          status: { type: 'string', example: 'SCHEDULED' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'user-uuid' },
              name: { type: 'string', example: 'Juan Pérez' },
              email: { type: 'string', example: 'juan.perez@email.com' },
            },
          },
          psychologist: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'psychologist-uuid' },
              name: { type: 'string', example: 'Dr. Ana García' },
              email: { type: 'string', example: 'ana.garcia@psychologist.com' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Token inválido o expirado' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener cita por ID',
    description:
      'Recuperar una cita específica con todos los detalles relacionados',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de la cita',
    example: 'appointment-uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Cita encontrada exitosamente',
    schema: {
      type: 'object',
      properties: {
        appointment_id: { type: 'string', example: 'appointment-uuid' },
        date: {
          type: 'string',
          format: 'date-time',
          example: '2024-03-15T10:00:00Z',
        },
        duration: { type: 'number', example: 60 },
        status: { type: 'string', example: 'SCHEDULED' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'user-uuid' },
            name: { type: 'string', example: 'Juan Pérez' },
            email: { type: 'string', example: 'juan.perez@email.com' },
          },
        },
        psychologist: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'psychologist-uuid' },
            name: { type: 'string', example: 'Dr. Ana García' },
            email: { type: 'string', example: 'ana.garcia@psychologist.com' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Cita no encontrada' })
  @ApiResponse({ status: 401, description: 'Token inválido o expirado' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar cita por ID',
    description: 'Actualizar detalles de la cita como fecha, duración o estado',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de la cita',
    example: 'appointment-uuid',
  })
  @ApiBody({ type: UpdateAppointmentDto })
  @ApiResponse({
    status: 200,
    description: 'Cita actualizada exitosamente',
    schema: {
      type: 'object',
      properties: {
        appointment_id: { type: 'string', example: 'appointment-uuid' },
        date: {
          type: 'string',
          format: 'date-time',
          example: '2024-03-15T14:00:00Z',
        },
        duration: { type: 'number', example: 90 },
        status: { type: 'string', example: 'CONFIRMED' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos de actualización inválidos' })
  @ApiResponse({ status: 404, description: 'Cita no encontrada' })
  @ApiResponse({ status: 401, description: 'Token inválido o expirado' })
  update(@Param('id') id: string, @Body() dto: UpdateAppointmentDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar cita por ID',
    description: 'Remover una cita del sistema',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de la cita',
    example: 'appointment-uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Cita eliminada exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Cita eliminada exitosamente',
        },
        appointment_id: { type: 'string', example: 'appointment-uuid' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Cita no encontrada' })
  @ApiResponse({ status: 401, description: 'Token inválido o expirado' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
