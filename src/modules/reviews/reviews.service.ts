import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { reviewResponseDto } from './dto/review-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reviews } from './entities/reviews.entity';
import { Repository } from 'typeorm';
import { Psychologist } from '../psychologist/entities/psychologist.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Reviews)
    private reviewsRepository: Repository<Reviews>,
    @InjectRepository(Psychologist)
    private readonly psychologistRepository: Repository<Psychologist>,
  ) {}

  async createNewReviewService(createReviewData: CreateReviewDto) {
    const foundReview = await this.reviewsRepository.findOne({
      where: { comment: createReviewData.comment },
    });

    if (foundReview) throw new BadRequestException('Review already exists');

    const newReview = this.reviewsRepository.create(createReviewData);

    await this.reviewsRepository.save(newReview);

    return { message: 'Review created successfully', review: newReview };
  }

  async findOneByPsychologistIdService(id: string): Promise<reviewResponseDto> {
    const psychologistReviews = await this.psychologistRepository.findOne({
      where: { id: id },
      relations: ['reviews'],
    });
    if (!psychologistReviews) {
      throw new BadRequestException('No reviews found for this psychologist');
    }

    if (!psychologistReviews.reviews.length) {
      throw new BadRequestException('No reviews found for this psychologist');
    }
    return { message: 'Reviews found', reviews: psychologistReviews };
  }

  async removeReviewByIdService(id: string) {
    await this.reviewsRepository.delete(id);
    return { message: 'Review removed successfully' };
  }
}
