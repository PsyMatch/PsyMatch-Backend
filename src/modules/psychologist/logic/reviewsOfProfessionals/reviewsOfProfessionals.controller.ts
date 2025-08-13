import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../../../auth/guards/auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { IAuthRequest } from '../../../auth/interfaces/auth-request.interface';
import { ReviewsProfessionalsService } from './reviewsOfProfessionals.service';

@Controller('psychologists/reviews')
@ApiTags('Psychologist')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class ReviewsOfProfessionalsController {
  constructor(private readonly reviewsService: ReviewsProfessionalsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all reviews for the logged-in psychologist',
    description:
      'Retrieve a list of all reviews written for the logged-in psychologist',
  })
  @ApiResponse({
    status: 200,
    description: 'List of reviews retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'No reviews found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findAll(@Req() req: IAuthRequest) {
    const userId = req.user.id;
    return await this.reviewsService.findAll(userId);
  }
}
