import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ERole } from '../../../../common/enums/role.enum';
import { Roles } from '../../../auth/decorators/role.decorator';
import { CombinedAuthGuard } from '../../../auth/guards/combined-auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { ReportsService } from './reports.service';

@Controller('admin/reports')
@ApiTags('Admin Reports')
@UseGuards(CombinedAuthGuard, RolesGuard)
@Roles([ERole.ADMIN])
@ApiBearerAuth('JWT-auth')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('appointments/last-2-weeks')
  @ApiOperation({
    summary:
      'Generar reporte de citas de las últimas 2 semanas (Solo administradores)',
  })
  async getLast2WeeksReport() {
    const report = await this.reportsService.triggerWeeklyReport();
    return {
      message: 'Reporte generado exitosamente',
      data: report,
    };
  }
}
