import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { PatientsOfProfessionalService } from './patientsOfProfessional.service';
import { IAuthRequest } from '../../../auth/interfaces/auth-request.interface';
import { Roles } from '../../../auth/decorators/role.decorator';
import { ERole } from '../../../../common/enums/role.enum';
import { ResponseUserDto } from '../../../users/dto/response-user.dto';
import { CombinedAuthGuard } from '../../../auth/guards/combined-auth.guard';

@ApiTags('Profesionales')
@Controller('psychologist/patients')
@UseGuards(CombinedAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class PatientsOfProfessionalController {
  constructor(
    private readonly patientsOfProfessionalService: PatientsOfProfessionalService,
  ) {}

  @Get()
  @Roles([ERole.PSYCHOLOGIST])
  @ApiOperation({
    summary: 'Obtener pacientes asignados al psicólogo logueado',
  })
  @ApiResponse({
    status: 200,
    description: 'Devuelve la lista de pacientes asignados al psicólogo',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token inválido o faltante',
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido - No es un psicólogo',
  })
  async getPatients(
    @Req() req: IAuthRequest,
  ): Promise<{ message: string; data: ResponseUserDto[] }> {
    const userId = req.user.id;
    return await this.patientsOfProfessionalService.getPatientsForPsychologist(
      userId,
    );
  }
}
