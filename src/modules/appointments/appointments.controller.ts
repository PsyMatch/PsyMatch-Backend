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
} from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@ApiTags('Appointments')
@Controller('appointments')
@UseGuards(AuthGuard)
@ApiBearerAuth('JWT-auth')
export class AppointmentsController {
  constructor(private readonly service: AppointmentsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new appointment',
    description:
      'Schedule a new appointment between a patient and psychologist',
  })
  @ApiBody({ type: CreateAppointmentDto })
  @ApiResponse({
    status: 201,
    description: 'Appointment created successfully',
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
  @ApiResponse({ status: 400, description: 'Invalid appointment data' })
  @ApiResponse({ status: 401, description: 'Invalid or expired token' })
  create(@Body() dto: CreateAppointmentDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all appointments',
    description: 'Retrieve all appointments with user and psychologist details',
  })
  @ApiResponse({
    status: 200,
    description: 'Appointments retrieved successfully',
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
  @ApiResponse({ status: 401, description: 'Invalid or expired token' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get appointment by ID',
    description: 'Retrieve a specific appointment with all related details',
  })
  @ApiParam({
    name: 'id',
    description: 'Appointment UUID',
    example: 'appointment-uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Appointment found successfully',
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
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  @ApiResponse({ status: 401, description: 'Invalid or expired token' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update appointment by ID',
    description: 'Update appointment details such as date, duration, or status',
  })
  @ApiParam({
    name: 'id',
    description: 'Appointment UUID',
    example: 'appointment-uuid',
  })
  @ApiBody({ type: UpdateAppointmentDto })
  @ApiResponse({
    status: 200,
    description: 'Appointment updated successfully',
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
  @ApiResponse({ status: 400, description: 'Invalid update data' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  @ApiResponse({ status: 401, description: 'Invalid or expired token' })
  update(@Param('id') id: string, @Body() dto: UpdateAppointmentDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete appointment by ID',
    description: 'Remove an appointment from the system',
  })
  @ApiParam({
    name: 'id',
    description: 'Appointment UUID',
    example: 'appointment-uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Appointment deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Appointment deleted successfully',
        },
        appointment_id: { type: 'string', example: 'appointment-uuid' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  @ApiResponse({ status: 401, description: 'Invalid or expired token' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
