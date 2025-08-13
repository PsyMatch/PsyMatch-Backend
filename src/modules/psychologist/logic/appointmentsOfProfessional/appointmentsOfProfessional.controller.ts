import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../../../../modules/auth/guards/auth.guard';
import { RolesGuard } from '../../../../modules/auth/guards/roles.guard';
import { AppointmentsOfProfessionalService } from './appointmentsOfProfessional.service';
import { IAuthRequest } from '../../../../modules/auth/interfaces/auth-request.interface';

@Controller('psychologist/appointments')
@ApiTags('Psychologist')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard, RolesGuard)
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
  async getAppointments(@Req() request: IAuthRequest) {
    const userId = request.user.id;
    return this.appointmentsService.getAppointmentsOfProfessional(userId);
  }
}
