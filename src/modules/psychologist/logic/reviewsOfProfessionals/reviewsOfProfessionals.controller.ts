import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JWTAuthGuard } from '../../../auth/guards/auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { IAuthRequest } from '../../../auth/interfaces/auth-request.interface';
import { ReviewsProfessionalsService } from './reviewsOfProfessionals.service';
import { Reviews } from 'src/modules/reviews/entities/reviews.entity';

@Controller('psychologists/reviews')
@ApiTags('Profesionales')
@UseGuards(JWTAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class ReviewsOfProfessionalsController {
  constructor(private readonly reviewsService: ReviewsProfessionalsService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las reseñas del psicólogo autenticado',
    description:
      'Obtener una lista de todas las reseñas escritas para el psicólogo autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de reseñas recuperadas exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontraron reseñas',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async findAll(
    @Req() req: IAuthRequest,
  ): Promise<{ message: string; data: Reviews }> {
    const userId = req.user.id;
    return await this.reviewsService.findAll(userId);
  }
}
