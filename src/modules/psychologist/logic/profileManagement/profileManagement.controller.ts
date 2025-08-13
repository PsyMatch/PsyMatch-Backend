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
  @ApiOperation({ summary: 'Get logged in psychologist profile' })
  @ApiResponse({
    status: 200,
    description: 'Returns the logged in psychologist profile information',
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
    description: 'Profile not found',
  })
  async getMe(@Req() req: IAuthRequest) {
    const userId = req.user.id;
    return await this.profileService.getPsychologistProfile(userId);
  }

  @Put('me')
  @Roles([ERole.PSYCHOLOGIST])
  @ApiOperation({ summary: 'Update logged in psychologist profile' })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated psychologist profile information',
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
    description: 'Profile not found',
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
