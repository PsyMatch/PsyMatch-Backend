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
} from '@nestjs/swagger';
import { reviewResponseDto } from './dto/review-response.dto';
import { Reviews } from './entities/reviews.entity';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([ERole.PATIENT, ERole.ADMIN, ERole.PSYCHOLOGIST])
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create a new review (logged-in users only)',
  })
  @ApiResponse({
    status: 201,
    description: 'Review created successfully',
    type: Reviews,
  })
  createNewReviewController(
    @Body() createReviewData: CreateReviewDto,
  ): Promise<{ message: string; review: Reviews }> {
    return this.reviewsService.createNewReviewService(createReviewData);
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([ERole.PATIENT, ERole.ADMIN, ERole.PSYCHOLOGIST])
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get reviews by psychologist ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Reviews found for the psychologist',
    type: reviewResponseDto,
  })
  findOneByPsychologistIdController(
    @Param('id') id: string,
  ): Promise<reviewResponseDto> {
    return this.reviewsService.findOneByPsychologistIdService(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([ERole.ADMIN])
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Delete a review by ID (Admin only)',
  })
  @ApiResponse({
    status: 200,
    description: 'Review removed successfully',
  })
  removeReviewByIdController(
    @Param('id') id: string,
  ): Promise<{ message: string }> {
    return this.reviewsService.removeReviewByIdService(id);
  }
}
