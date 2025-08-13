import { Controller, Get, UseGuards, Req, Put, Body } from '@nestjs/common';
import { AuthGuard } from '../../../auth/guards/auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { Roles } from '../../../auth/decorators/role.decorator';
import { ERole } from '../../../../common/enums/role.enum';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProfileService } from './profileManagement.service';
import { IAuthRequest } from '../../../auth/interfaces/auth-request.interface';
import { UpdatePsychologistDto } from '../../dto/update-psychologist.dto';

@ApiTags('Psychologist')
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
  async getMe(@Req() req: IAuthRequest) {
    const userId = req.user.id;
    return await this.profileService.getPsychologistProfile(userId);
  }

  @Put('me')
  @Roles([ERole.PSYCHOLOGIST])
  @ApiOperation({ summary: 'Actualizar perfil del psicólogo logueado' })
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
  ) {
    const userId = req.user.id;
    return await this.profileService.updatePsychologistProfile(
      userId,
      updateDto,
    );
  }
}
