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
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
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

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar cita (dueño, psicólogo asignado o admin)',
  })
  @ApiParam({ name: 'id', description: 'UUID de la cita' })
  @ApiBody({ type: UpdateAppointmentDto })
  update(
    @Req() req: IAuthRequest,
    @Param('id') id: string,
    @Body() dto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(req, id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar/Cancelar cita (dueño o admin)',
  })
  @ApiParam({ name: 'id', description: 'UUID de la cita' })
  remove(@Req() req: IAuthRequest, @Param('id') id: string) {
    return this.appointmentsService.remove(req, id);
  }
}
