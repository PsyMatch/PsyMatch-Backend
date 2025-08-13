import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Citas')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new appointment' })
  create(@Body() dto: CreateAppointmentDto) {
    return this.appointmentsService.create(dto);
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
    return this.appointmentsService.findAll();
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
    return this.appointmentsService.findOne(id);
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
    return this.appointmentsService.update(id, dto);
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
    return this.appointmentsService.remove(id);
  }
}
