import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { reviewResponseDto } from './dto/review-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reviews } from './entities/reviews.entity';
import { Repository } from 'typeorm';
import { Psychologist } from '../psychologist/entities/psychologist.entity';
import { Appointment } from '../appointments/entities/appointment.entity';
import { AppointmentStatus } from '../appointments/enums/appointment-status.enum';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Reviews)
    private reviewsRepository: Repository<Reviews>,
    @InjectRepository(Psychologist)
    private readonly psychologistRepository: Repository<Psychologist>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  async createNewReviewService(
    createReviewData: CreateReviewDto,
    userId: string,
  ): Promise<{ message: string; review: Reviews }> {
    const { psychologistId, rating, comment } = createReviewData;

    const psychologist = await this.psychologistRepository.findOne({
      where: { id: psychologistId },
    });
    if (!psychologist) {
      throw new BadRequestException('Psicólogo no encontrado');
    }

    const appointment = await this.appointmentRepository.findOne({
      where: {
        psychologist: { id: psychologistId },
        patient: { id: userId },
        status: AppointmentStatus.COMPLETED,
      },
    });

    if (!appointment) {
      throw new BadRequestException(
        'No puedes dejar una reseña sin haber tenido una cita completada con este psicólogo',
      );
    }

    const existingReview = await this.reviewsRepository.findOne({
      where: {
        psychologist: { id: psychologistId },
        userId: userId,
      },
    });

    if (existingReview) {
      throw new BadRequestException(
        'Ya has dejado una reseña para este psicólogo',
      );
    }
    const newReview = this.reviewsRepository.create({
      psychologist: psychologist,
      userId: userId,
      rating,
      comment,
      review_date: new Date(),
    });

    await this.reviewsRepository.save(newReview);

    return { message: 'Reseña creada exitosamente', review: newReview };
  }

  async findOneByPsychologistIdService(id: string): Promise<reviewResponseDto> {
    const psychologistReviews = await this.psychologistRepository.findOne({
      where: { id: id },
      relations: ['reviews'],
    });
    if (!psychologistReviews) {
      throw new BadRequestException(
        'No se encontraron reseñas para este psicólogo',
      );
    }

    if (!psychologistReviews.reviews.length) {
      throw new BadRequestException(
        'No se encontraron reseñas para este psicólogo',
      );
    }
    return { message: 'Reseñas encontradas', reviews: psychologistReviews };
  }

  async removeReviewByIdService(id: string): Promise<{ message: string }> {
    await this.reviewsRepository.delete(id);
    return { message: 'Reseña eliminada exitosamente' };
  }

  async getMyReviewsService(userId: string): Promise<Reviews[]> {
    const myReviews = await this.reviewsRepository.find({
      where: { userId: userId },
      relations: ['psychologist'],
    });
    return myReviews;
  }
}
