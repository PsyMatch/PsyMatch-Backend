import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
  Query,
  UseInterceptors,
  Patch,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { IAuthRequest } from '../auth/interfaces/auth-request.interface';
import { CombinedAuthGuard } from '../auth/guards/combined-auth.guard';
import { CreateAppointmentDocumentation } from './documentation/createApppointment.documentation';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Citas')
@UseGuards(CombinedAuthGuard)
@ApiBearerAuth('JWT-auth')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  @CreateAppointmentDocumentation()
  create(@Req() req: IAuthRequest, @Body() dto: CreateAppointmentDto) {
    return this.appointmentsService.create(req, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar citas (admin ve todas; otros solo las propias)',
  })
  findAll(@Req() req: IAuthRequest) {
    return this.appointmentsService.findAll(req);
  }

  @Get('me')
  @ApiOperation({ summary: 'Mis citas (por usuario autenticado)' })
  findMine(@Req() req: IAuthRequest) {
    return this.appointmentsService.findMine(req);
  }

  @Get('available')
  @ApiOperation({
    summary: 'Disponibilidad dinámica (sin seeder)',
    description:
      'Devuelve slots disponibles generados al vuelo para un psicólogo y una fecha',
  })
  @ApiQuery({ name: 'psychologistId', required: true })
  @ApiQuery({ name: 'date', required: true, description: 'YYYY-MM-DD' })
  @ApiQuery({
    name: 'slotMinutes',
    required: false,
    description: 'Tamaño de turno (min). Default 30',
  })
  getAvailable(
    @Query('psychologistId') psychologistId: string,
    @Query('date') date: string,
    @Query('slotMinutes') slotMinutes?: string,
  ) {
    return this.appointmentsService.getAvailableSlots(
      psychologistId,
      date,
      slotMinutes ? parseInt(slotMinutes, 10) : 30,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener cita por ID (dueño, psicólogo asignado o admin)',
  })
  @ApiParam({ name: 'id', description: 'UUID de la cita' })
  findOne(@Req() req: IAuthRequest, @Param('id') id: string) {
    return this.appointmentsService.findOneAuthorized(req, id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Deshabilitar cita ',
    description:
      'Establece isActive en false en lugar de eliminar la cita completamente. Solo el dueño o admin pueden deshabilitar la cita.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de la cita a deshabilitar',
    type: 'string',
    format: 'uuid',
  })
  disable(@Req() req: IAuthRequest, @Param('id') id: string) {
    return this.appointmentsService.disable(req, id);
  }

  @Patch(':id/confirm')
  @ApiOperation({
    summary: 'Confirmar cita',
    description:
      'Cambia el estado de la cita de PENDING a CONFIRMED. Solo el psicólogo asignado puede confirmar la cita.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de la cita a confirmar',
    type: 'string',
    format: 'uuid',
  })
  confirmAppointment(@Req() req: IAuthRequest, @Param('id') id: string) {
    return this.appointmentsService.confirmAppointment(req, id);
  }

  @Patch(':id/complete')
  @ApiOperation({
    summary: 'Completar cita',
    description:
      'Cambia el estado de la cita de CONFIRMED a COMPLETED. Solo el psicólogo asignado puede completar la cita.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de la cita a completar',
    type: 'string',
    format: 'uuid',
  })
  completeAppointment(@Req() req: IAuthRequest, @Param('id') id: string) {
    return this.appointmentsService.completeAppointment(req, id);
  }

  @Put(':id/approve')
  @ApiOperation({
    summary: 'Aprobar una cita',
    description:
      'Aprueba una cita que está pendiente de aprobación después del pago',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de la cita a aprobar',
    type: 'string',
    format: 'uuid',
  })
  approveAppointment(@Req() req: IAuthRequest, @Param('id') id: string) {
    return this.appointmentsService.approveAppointment(req, id);
  }
}
