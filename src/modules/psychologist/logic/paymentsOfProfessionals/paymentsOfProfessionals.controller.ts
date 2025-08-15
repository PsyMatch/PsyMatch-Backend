import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ERole } from '../../../../common/enums/role.enum';
import { Roles } from '../../../auth/decorators/role.decorator';
import { JWTAuthGuard } from '../../../auth/guards/auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { IAuthRequest } from '../../../auth/interfaces/auth-request.interface';
import { PaymentsOfProfessionalsService } from './paymentsOfProfessionals.service';
import { Payment } from 'src/modules/payments/entities/payment.entity';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Profesionales')
@UseGuards(JWTAuthGuard, RolesGuard, AuthGuard('google'))
@ApiBearerAuth('JWT-auth')
@Controller('psychologist/payments')
export class PaymentsOfProfessionalsController {
  constructor(
    private readonly paymentsService: PaymentsOfProfessionalsService,
  ) {}

  @Get()
  @Roles([ERole.PSYCHOLOGIST])
  @ApiOperation({ summary: 'Obtener los pagos del psicólogo logueado' })
  @ApiResponse({ status: 200, description: 'Pagos recuperados exitosamente' })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token inválido o faltante',
  })
  @ApiResponse({ status: 403, description: 'Prohibido - No es un psicólogo' })
  @ApiResponse({ status: 404, description: 'No se encontraron pagos' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async getPayments(
    @Req() request: IAuthRequest,
  ): Promise<{ message: string; data: Payment[] }> {
    const userId = request.user.id;
    return await this.paymentsService.getPaymentsOfProfessional(userId);
  }
}
