import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ERole } from '../../common/enums/role.enum';
import { Roles } from '../auth/decorators/role.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { reviewResponseDto } from './dto/review-response.dto';
import { Reviews } from './entities/reviews.entity';
import { Request } from 'express';
import { IAuthRequest } from '../auth/interfaces/auth-request.interface';
import { CombinedAuthGuard } from '../auth/guards/combined-auth.guard';

@ApiTags('Reseñas')
@Controller('reviews')
@UseGuards(CombinedAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles([ERole.PATIENT, ERole.ADMIN])
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Crear una nueva reseña',
    description:
      'Crear una reseña para un psicólogo. Puede ser realizada por pacientes que han tenido sesiones con el psicólogo.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        psychologist_id: { type: 'string', example: 'psychologist-uuid' },
        rating: { type: 'string', example: '5' },
        comment: { type: 'string', example: 'Excelente servicio profesional' },
        session_date: { type: 'string', example: '2024-03-15T10:00:00Z' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Reseña creada exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Reseña creada exitosamente',
        },
        review: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'review-uuid' },
            comment: {
              type: 'string',
              example: 'Excelente psicólogo, muy profesional.',
            },
            rating: { type: 'number', example: 5 },
            psychologist_id: {
              type: 'string',
              example: 'psychologist-uuid',
            },
            user_id: { type: 'string', example: 'user-uuid' },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2024-03-15T10:00:00Z',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Solicitud incorrecta - La reseña ya existe o datos inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido o expirado',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - Permisos insuficientes',
  })
  createNewReviewController(
    @Req() req: IAuthRequest,
    @Body() createReviewData: CreateReviewDto,
  ): Promise<{ message: string; review: Reviews }> {
    const userId = req.user.id;
    return this.reviewsService.createNewReviewService(createReviewData, userId);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles([ERole.PATIENT, ERole.ADMIN, ERole.PSYCHOLOGIST])
  @ApiOperation({
    summary: 'Obtener reseñas por ID de psicólogo',
    description:
      'Recuperar todas las reseñas de un psicólogo específico con calificación promedio y número de reseñas.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del psicólogo',
    example: 'psychologist-uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Reseñas recuperadas exitosamente',
    schema: {
      type: 'object',
      properties: {
        psychologist_id: {
          type: 'string',
          example: 'psychologist-uuid',
        },
        psychologist_name: {
          type: 'string',
          example: 'Dr. Ana García',
        },
        average_rating: {
          type: 'number',
          example: 4.5,
          description: 'Calificación promedio de todas las reseñas',
        },
        total_reviews: {
          type: 'number',
          example: 12,
          description: 'Número total de reseñas',
        },
        reviews: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'review-uuid' },
              comment: {
                type: 'string',
                example: 'Excelente psicólogo, muy profesional.',
              },
              rating: { type: 'number', example: 5 },
              user_name: {
                type: 'string',
                example: 'Juan Pérez',
                description: 'Nombre del usuario que dejó la reseña',
              },
              created_at: {
                type: 'string',
                format: 'date-time',
                example: '2024-03-15T10:00:00Z',
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido o expirado',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - Permisos insuficientes',
  })
  @ApiResponse({
    status: 404,
    description: 'Psicólogo no encontrado o no hay reseñas disponibles',
  })
  findOneByPsychologistIdController(
    @Param('id') id: string,
  ): Promise<reviewResponseDto> {
    return this.reviewsService.findOneByPsychologistIdService(id);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles([ERole.ADMIN])
  @ApiOperation({
    summary: 'Eliminar una reseña por ID (Solo administradores)',
    description:
      'Eliminar permanentemente una reseña del sistema. Solo los administradores pueden realizar esta acción.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de la reseña',
    example: 'review-uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Reseña eliminada exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Reseña eliminada exitosamente',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido o expirado',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - Se requiere rol de administrador',
  })
  @ApiResponse({
    status: 404,
    description: 'Reseña no encontrada',
  })
  removeReviewByIdController(
    @Param('id') id: string,
  ): Promise<{ message: string }> {
    return this.reviewsService.removeReviewByIdService(id);
  }
}
