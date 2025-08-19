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
    const foundReview = await this.reviewsRepository.findOne({
      where: { comment: createReviewData.comment },
    });

    const completedAppointment = await this.appointmentRepository.findOne({
      where: {
        patient: { id: userId },
        psychologist: { id: createReviewData.psychologistId },
        status: AppointmentStatus.COMPLETED,
      },
      relations: ['patient', 'psychologist'],
    });

    if (!completedAppointment) {
      throw new BadRequestException(
        'Solo puede dejar una reseña después de completar una cita con el profesional',
      );
    }

    if (foundReview) {
      throw new BadRequestException('La reseña ya existe');
    }

    const newReview = this.reviewsRepository.create(createReviewData);

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
}
