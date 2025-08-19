import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from '../../../../modules/auth/guards/roles.guard';
import { AppointmentsOfProfessionalService } from './appointmentsOfProfessional.service';
import { IAuthRequest } from '../../../../modules/auth/interfaces/auth-request.interface';
import { Appointment } from '../../../appointments/entities/appointment.entity';
import { CombinedAuthGuard } from 'src/modules/auth/guards/combined-auth.guard';

@Controller('psychologist/appointments')
@ApiTags('Profesionales')
@ApiBearerAuth('JWT-auth')
@UseGuards(CombinedAuthGuard, RolesGuard)
export class AppointmentsOfProfessionalController {
  constructor(
    private readonly appointmentsService: AppointmentsOfProfessionalService,
  ) {}

  @Get()
  @ApiOperation({
    summary: '[Turnos] Obtener turnos del psicólogo',
    description: 'Obtener todos los turnos del psicólogo logueado',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de turnos recuperados exitosamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token inválido o faltante',
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido - No es un psicólogo',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontraron turnos',
  })
  async getAppointments(
    @Req() request: IAuthRequest,
  ): Promise<{ message: string; data: Appointment[] }> {
    const userId = request.user.id;
    return this.appointmentsService.getAppointmentsOfProfessional(userId);
  }
}
