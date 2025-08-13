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
    summary: '[Appointments] Get psychologist appointments',
    description: 'Get all appointments for the logged-in psychologist',
  })
  @ApiResponse({
    status: 200,
    description: 'List of appointments retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not a psychologist',
  })
  @ApiResponse({
    status: 404,
    description: 'No appointments found',
  })
  async getAppointments(@Req() request: IAuthRequest) {
    const userId = request.user.id;
    return this.appointmentsService.getAppointmentsOfProfessional(userId);
  }
}
