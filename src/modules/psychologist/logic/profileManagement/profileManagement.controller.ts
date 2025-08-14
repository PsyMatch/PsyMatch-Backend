import { Controller, Get, UseGuards, Req, Put, Body } from '@nestjs/common';
import { AuthGuard } from '../../../auth/guards/auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { Roles } from '../../../auth/decorators/role.decorator';
import { ERole } from '../../../../common/enums/role.enum';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { EPsychologistSpecialty } from '../../enums/specialities.enum';
import { ETherapyApproach } from '../../enums/therapy-approaches.enum';
import { ESessionType } from '../../enums/session-types.enum';
import { EModality } from '../../enums/modality.enum';
import { EInsurance } from '../../../users/enums/insurances.enum';
import { ProfileService } from './profileManagement.service';
import { IAuthRequest } from '../../../auth/interfaces/auth-request.interface';
import { UpdatePsychologistDto } from '../../dto/update-psychologist.dto';
import { ResponseProfessionalDto } from '../../dto/response-professional.dto';

@ApiTags('Profesionales')
@Controller('psychologist')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class ProfileManagementController {
  constructor(private profileService: ProfileService) {}

  @Get('me')
  @Roles([ERole.PSYCHOLOGIST])
  @ApiOperation({ summary: 'Obtener perfil del psicólogo logueado' })
  @ApiResponse({
    status: 200,
    description: 'Devuelve la información del perfil del psicólogo logueado',
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
    description: 'Perfil no encontrado',
  })
  async getMe(
    @Req() req: IAuthRequest,
  ): Promise<{ message: string; data: ResponseProfessionalDto }> {
    const userId = req.user.id;
    return await this.profileService.getPsychologistProfile(userId);
  }

  @Put('me')
  @Roles([ERole.PSYCHOLOGIST])
  @ApiOperation({ summary: 'Actualizar perfil del psicólogo logueado' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UpdatePsychologistDto,
    description: 'Datos actualizables del perfil del psicólogo',
    examples: {
      fullUpdate: {
        value: {
          license_number: 'PSI-12345-BA',
          office_address: 'Av. Corrientes 1234, Oficina 302, Buenos Aires',
          professional_experience: 5,
          specialities: [
            EPsychologistSpecialty.ANXIETY_DISORDER,
            EPsychologistSpecialty.DEPRESSION,
          ],
          therapy_approaches: [ETherapyApproach.COGNITIVE_BEHAVIORAL_THERAPY],
          session_types: [ESessionType.INDIVIDUAL],
          modality: EModality.ONLINE,
          insurance_accepted: [EInsurance.OSDE, EInsurance.SWISS_MEDICAL],
          personal_biography:
            'Psicólogo clínico licenciado con más de 5 años de experiencia...',
          availability: '{"lunes": ["09:00-12:00", "14:00-18:00"]}',
          professional_title: 'Licenciado en Psicología',
        },
        description: 'Ejemplo de actualización completa del perfil',
      },
      partialUpdate: {
        value: {
          office_address: 'Av. Corrientes 1234, Oficina 302, Buenos Aires',
          modality: EModality.HYBRID,
          specialities: [EPsychologistSpecialty.ANXIETY_DISORDER],
          insurance_accepted: [EInsurance.OSDE],
        },
        description: 'Ejemplo de actualización parcial del perfil',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Devuelve la información del perfil del psicólogo actualizado',
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
    description: 'Perfil no encontrado',
  })
  async updateMe(
    @Req() req: IAuthRequest,
    @Body() updateDto: UpdatePsychologistDto,
  ): Promise<{ message: string; data: ResponseProfessionalDto }> {
    const userId = req.user.id;
    return await this.profileService.updatePsychologistProfile(
      userId,
      updateDto,
    );
  }
}
