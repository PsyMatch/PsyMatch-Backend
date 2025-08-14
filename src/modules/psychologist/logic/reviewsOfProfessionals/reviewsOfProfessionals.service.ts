import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reviews } from '../../../../modules/reviews/entities/reviews.entity';

@Injectable()
export class ReviewsProfessionalsService {
  constructor(
    @InjectRepository(Reviews)
    private readonly reviewsRepository: Repository<Reviews>,
  ) {}

  async findAll(userId: string): Promise<{ message: string; data: Reviews }> {
    const reviews = await this.reviewsRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!reviews) {
      throw new NotFoundException('Reseñas no encontradas');
    }

    return { message: 'Reseñas encontradas', data: reviews };
  }
}
