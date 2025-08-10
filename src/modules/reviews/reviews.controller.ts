import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { AuthGuard } from '../auth/guards/auth.guard';
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
} from '@nestjs/swagger';
import { reviewResponseDto } from './dto/review-response.dto';
import { Reviews } from './entities/reviews.entity';

@ApiTags('Reviews')
@Controller('reviews')
@UseGuards(AuthGuard)
@ApiBearerAuth('JWT-auth')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles([ERole.PATIENT, ERole.ADMIN, ERole.PSYCHOLOGIST])
  @ApiOperation({
    summary: 'Create a new review',
    description:
      'Create a review for a psychologist. Can be done by patients who have had sessions with the psychologist.',
  })
  @ApiBody({ type: CreateReviewDto })
  @ApiResponse({
    status: 201,
    description: 'Review created successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Review created successfully',
        },
        review: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'review-uuid' },
            comment: {
              type: 'string',
              example: 'Excellent psychologist, very professional.',
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
    description: 'Bad request - Review already exists or invalid data',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired token',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied - Insufficient permissions',
  })
  createNewReviewController(
    @Body() createReviewData: CreateReviewDto,
  ): Promise<{ message: string; review: Reviews }> {
    return this.reviewsService.createNewReviewService(createReviewData);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles([ERole.PATIENT, ERole.ADMIN, ERole.PSYCHOLOGIST])
  @ApiOperation({
    summary: 'Get reviews by psychologist ID',
    description:
      'Retrieve all reviews for a specific psychologist with average rating and review count.',
  })
  @ApiParam({
    name: 'id',
    description: 'Psychologist UUID',
    example: 'psychologist-uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Reviews retrieved successfully',
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
          description: 'Average rating from all reviews',
        },
        total_reviews: {
          type: 'number',
          example: 12,
          description: 'Total number of reviews',
        },
        reviews: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'review-uuid' },
              comment: {
                type: 'string',
                example: 'Excellent psychologist, very professional.',
              },
              rating: { type: 'number', example: 5 },
              user_name: {
                type: 'string',
                example: 'Juan Pérez',
                description: 'Name of the user who left the review',
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
    description: 'Invalid or expired token',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied - Insufficient permissions',
  })
  @ApiResponse({
    status: 404,
    description: 'Psychologist not found or no reviews available',
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
    summary: 'Delete a review by ID (Admin only)',
    description:
      'Permanently delete a review from the system. Only administrators can perform this action.',
  })
  @ApiParam({
    name: 'id',
    description: 'Review UUID',
    example: 'review-uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Review deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Review deleted successfully',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired token',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied - Admin role required',
  })
  @ApiResponse({
    status: 404,
    description: 'Review not found',
  })
  removeReviewByIdController(
    @Param('id') id: string,
  ): Promise<{ message: string }> {
    return this.reviewsService.removeReviewByIdService(id);
  }
}
