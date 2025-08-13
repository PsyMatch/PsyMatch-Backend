import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../../../auth/guards/auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { PatientsOfProfessionalService } from './patientsOfProfessional.service';
import { IAuthRequest } from '../../../auth/interfaces/auth-request.interface';
import { Roles } from '../../../auth/decorators/role.decorator';
import { ERole } from '../../../../common/enums/role.enum';

@ApiTags('Psychologist')
@Controller('psychologist/patients')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class PatientsOfProfessionalController {
  constructor(
    private readonly patientsOfProfessionalService: PatientsOfProfessionalService,
  ) {}

  @Get()
  @Roles([ERole.PSYCHOLOGIST])
  @ApiOperation({
    summary: 'Get patients assigned to the logged in psychologist',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the list of patients assigned to the psychologist',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not a psychologist',
  })
  async getPatients(@Req() req: IAuthRequest) {
    const userId = req.user.id;
    return await this.patientsOfProfessionalService.getPatientsForPsychologist(
      userId,
    );
  }
}
