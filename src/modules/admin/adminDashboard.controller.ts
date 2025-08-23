import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminDashboardService } from './adminDashboard.service';
import { ApiTags } from '@nestjs/swagger';
import { GetMetricsSwaggerDoc } from './documentation/metrics.doc';
import { CombinedAuthGuard } from '../auth/guards/combined-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { ERole } from '../../common/enums/role.enum';

@ApiTags('Dashboard de Administrador')
@Controller('admin/dashboard')
export class AdminDashboardController {
  constructor(private readonly adminDashboardService: AdminDashboardService) {}

  @Get('metrics')
  @UseGuards(CombinedAuthGuard, RolesGuard)
  @Roles([ERole.ADMIN])
  @GetMetricsSwaggerDoc()
  async getMetrics() {
    return await this.adminDashboardService.getMetrics();
  }
}
