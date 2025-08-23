import { Controller, Get } from '@nestjs/common';
import { AdminDashboardService } from './adminDashboard.service';

@Controller('admin/dashboard')
export class AdminDashboardController {
  constructor(private readonly adminDashboardService: AdminDashboardService) {}

  @Get('metrics')
  async getMetrics() {
    return await this.adminDashboardService.getMetrics();
  }
}
