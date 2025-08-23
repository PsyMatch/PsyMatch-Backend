import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../users/entities/user.entity';
import { ERole } from '../../../../common/enums/role.enum';
import { Appointment } from '../../../appointments/entities/appointment.entity';
import { Reviews } from '../../../reviews/entities/reviews.entity';
import { Payment } from '../../../payments/entities/payment.entity';

@Injectable()
export class AdminDashboardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Reviews)
    private readonly reviewRepository: Repository<Reviews>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async getMetrics() {
    // Get total counts
    const [users, appointments, reviews, payments, patients, professionals] =
      await Promise.all([
        this.userRepository.count(),
        this.appointmentRepository.count(),
        this.reviewRepository.count(),
        this.paymentRepository.count(),
        this.userRepository.count({ where: { role: ERole.PATIENT } }),
        this.userRepository.count({ where: { role: ERole.PSYCHOLOGIST } }),
      ]);

    // Agrupar por semana (últimas 6 semanas)
    const appointmentsByWeek = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .select([
        "TO_CHAR(DATE_TRUNC('week', appointment.date), 'IYYY-IW') AS week",
        'COUNT(*)::int AS value',
      ])
      .where("appointment.date >= NOW() - INTERVAL '6 weeks'")
      .groupBy('week')
      .orderBy('week', 'ASC')
      .getRawMany();

    // Agrupar por día (últimos 14 días)
    const appointmentsByDay = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .select([
        "TO_CHAR(DATE_TRUNC('day', appointment.date), 'YYYY-MM-DD') AS day",
        'COUNT(*)::int AS value',
      ])
      .where("appointment.date >= NOW() - INTERVAL '14 days'")
      .groupBy('day')
      .orderBy('day', 'ASC')
      .getRawMany();

    const reviewsByWeek = await this.reviewRepository
      .createQueryBuilder('review')
      .select([
        "TO_CHAR(DATE_TRUNC('week', review.review_date), 'IYYY-IW') AS week",
        'COUNT(*)::int AS value',
      ])
      .where("review.review_date >= NOW() - INTERVAL '6 weeks'")
      .groupBy('week')
      .orderBy('week', 'ASC')
      .getRawMany();

    const paymentsByWeek = await this.paymentRepository
      .createQueryBuilder('payment')
      .select([
        "TO_CHAR(DATE_TRUNC('week', payment.created_at), 'IYYY-IW') AS week",
        'COUNT(*)::int AS value',
      ])
      .where("payment.created_at >= NOW() - INTERVAL '6 weeks'")
      .groupBy('week')
      .orderBy('week', 'ASC')
      .getRawMany();

    const usersByWeek = await this.userRepository
      .createQueryBuilder('user')
      .select([
        "TO_CHAR(DATE_TRUNC('week', user.created_at), 'IYYY-IW') AS week",
        'COUNT(*)::int AS value',
      ])
      .where("user.created_at >= NOW() - INTERVAL '6 weeks'")
      .groupBy('week')
      .orderBy('week', 'ASC')
      .getRawMany();

    return {
      users,
      appointments,
      reviews,
      payments,
      patients,
      professionals,
      weekly: {
        appointments: appointmentsByWeek,
        reviews: reviewsByWeek,
        payments: paymentsByWeek,
        users: usersByWeek,
      },
      daily: {
        appointments: appointmentsByDay,
      },
    };
  }
}
