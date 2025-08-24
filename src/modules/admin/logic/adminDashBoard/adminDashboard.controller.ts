import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AdminDashboardService } from './adminDashboard.service';
import { Reviews } from '../../../reviews/entities/reviews.entity';

@Controller('admin/dashboard')
export class AdminDashboardController {
  constructor(private readonly adminDashboardService: AdminDashboardService) {}

  @Get('metrics')
  async getMetrics() {
    return await this.adminDashboardService.getMetrics();
  }
  @Get('page-visits')
  @ApiOperation({ summary: 'Obtener estadísticas de páginas visitadas' })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas de páginas visitadas obtenidas exitosamente',
  })
  async getPageVisits(): Promise<{
    message: string;
    data: Array<{ page: string; visits: number }>;
  }> {
    const data = await this.adminDashboardService.getPageVisits();
    return {
      message: 'Page visits retrieved successfully',
      data,
    };
  }

  @Get('reviews')
  @ApiOperation({ summary: 'Obtener todas las reseñas' })
  @ApiResponse({
    status: 200,
    description: 'Reseñas obtenidas exitosamente',
  })
  async getAllReviews(): Promise<{
    message: string;
    reviews: Reviews[];
  }> {
    const reviews = await this.adminDashboardService.getAllReviews();
    return {
      message: 'Reviews retrieved successfully',
      reviews,
    };
  }
}
