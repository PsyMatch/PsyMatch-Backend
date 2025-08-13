import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ERole } from '../../../../common/enums/role.enum';
import { Roles } from '../../../auth/decorators/role.decorator';
import { AuthGuard } from '../../../auth/guards/auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { IAuthRequest } from '../../../auth/interfaces/auth-request.interface';
import { PaymentsOfProfessionalsService } from './paymentsOfProfessionals.service';

@ApiTags('Psychologist')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
@Controller('psychologist/payments')
export class PaymentsOfProfessionalsController {
  constructor(
    private readonly paymentsService: PaymentsOfProfessionalsService,
  ) {}

  @Get()
  @Roles([ERole.PSYCHOLOGIST])
  @ApiOperation({ summary: 'Get payments of the logged-in psychologist' })
  @ApiResponse({ status: 200, description: 'Payments retrieved successfully' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Not a psychologist' })
  @ApiResponse({ status: 404, description: 'No payments found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getPayments(@Req() request: IAuthRequest) {
    const userId = request.user.id;
    return await this.paymentsService.getPaymentsOfProfessional(userId);
  }
}
