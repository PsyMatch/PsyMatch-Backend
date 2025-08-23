import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewRequest } from './dto/update-review.dto';
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

  @ApiConsumes('application/json')
  @ApiOperation({
    summary: 'Crear una nueva reseña',
    description:
      'Crear una reseña para un psicólogo. Solo puede ser realizada por pacientes que han tenido al menos una cita completada con el psicólogo. No se permite más de una reseña por paciente por psicólogo.',
  })
  @ApiBody({
    type: CreateReviewDto,
    description: 'Datos necesarios para crear una reseña',
    examples: {
      'reseña-positiva': {
        summary: 'Reseña positiva',
        value: {
          psychologistId: '123e4567-e89b-12d3-a456-426614174000',
          rating: 5,
          comment:
            'Excelente profesional, muy empático y efectivo en sus técnicas terapéuticas.',
        },
      },
      'reseña-regular': {
        summary: 'Reseña regular',
        value: {
          psychologistId: '123e4567-e89b-12d3-a456-426614174000',
          rating: 3,
          comment:
            'Buena atención pero esperaba un poco más de seguimiento personalizado.',
        },
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
              example: 'Excelente psicólogo, muy profesional y empático.',
            },
            rating: { type: 'number', example: 5 },
            psychologistId: {
              type: 'string',
              example: 'psychologist-uuid',
            },
            userId: { type: 'string', example: 'user-uuid' },
            createdAt: {
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
    description: 'Solicitud incorrecta',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          examples: [
            'Psicólogo no encontrado',
            'No puedes dejar una reseña sin haber tenido una cita completada con este psicólogo',
            'Ya has dejado una reseña para este psicólogo',
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
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
  @Post()
  @UseGuards(RolesGuard)
  @Roles([ERole.PATIENT, ERole.ADMIN])
  createNewReviewController(
    @Req() req: IAuthRequest,
    @Body() createReviewData: CreateReviewDto,
  ): Promise<{ message: string; review: Reviews }> {
    const userId = req.user.id;
    return this.reviewsService.createNewReviewService(createReviewData, userId);
  }
  @ApiOperation({
    summary: 'Obtener mis reseñas',
    description:
      'Recuperar todas las reseñas que el usuario autenticado ha escrito, incluyendo información del psicólogo asociado.',
  })
  @ApiResponse({
    status: 200,
    description: 'Reseñas del usuario recuperadas exitosamente',
    schema: {
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
          userId: { type: 'string', example: 'user-uuid' },
          review_date: {
            type: 'string',
            format: 'date-time',
            example: '2024-03-15T10:00:00Z',
          },
          psychologist: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'psychologist-uuid' },
              first_name: { type: 'string', example: 'Ana' },
              last_name: { type: 'string', example: 'García' },
              specialization: { type: 'string', example: 'Psicología Clínica' },
              profile_picture: {
                type: 'string',
                example: 'https://example.com/profile.jpg',
                nullable: true,
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
  @Get('my-reviews')
  @UseGuards(RolesGuard)
  @Roles([ERole.PSYCHOLOGIST, ERole.ADMIN, ERole.PATIENT])
  getMyReviewsController(@Req() req: IAuthRequest): Promise<Reviews[]> {
    const userId = req.user.id;
    return this.reviewsService.getMyReviewsService(userId);
  }

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
  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles([ERole.PATIENT, ERole.ADMIN, ERole.PSYCHOLOGIST])
  findOneByPsychologistIdController(
    @Param('id') id: string,
  ): Promise<reviewResponseDto> {
    return this.reviewsService.findOneByPsychologistIdService(id);
  }

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
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles([ERole.ADMIN])
  removeReviewByIdController(
    @Param('id') id: string,
  ): Promise<{ message: string }> {
    return this.reviewsService.removeReviewByIdService(id);
  }

  @ApiOperation({
    summary: 'Actualizar una reseña',
    description:
      'Actualizar el rating y comentario de una reseña existente. Solo puede ser realizada por el autor de la reseña o administradores.',
  })
  @ApiBody({
    type: UpdateReviewRequest,
    description: 'Datos necesarios para actualizar una reseña',
    examples: {
      'actualizar-reseña': {
        summary: 'Actualizar reseña',
        value: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          rating: 4,
          comment:
            'Actualicé mi opinión después de más sesiones. Muy buen profesional.',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Reseña actualizada exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Reseña actualizada exitosamente',
        },
        review: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'review-uuid' },
            comment: {
              type: 'string',
              example: 'Comentario actualizado sobre el psicólogo.',
            },
            rating: { type: 'number', example: 4 },
            psychologistId: {
              type: 'string',
              example: 'psychologist-uuid',
            },
            userId: { type: 'string', example: 'user-uuid' },
            review_date: {
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
    description: 'Solicitud incorrecta',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Reseña no encontrada',
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
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
  @Patch('update')
  @UseGuards(RolesGuard)
  @Roles([ERole.PATIENT, ERole.ADMIN])
  async updateReviewController(
    @Req() req: IAuthRequest,
    @Body() updateReviewData: UpdateReviewRequest,
  ): Promise<{ message: string; review: Reviews }> {
    const userId = req.user.id;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    return await this.reviewsService.updateReviewByIdService(
      updateReviewData,
      userId,
    );
  }
}
