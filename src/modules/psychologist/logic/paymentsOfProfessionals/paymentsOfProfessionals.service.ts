import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../../../../modules/payments/entities/payment.entity';

@Injectable()
export class PaymentsOfProfessionalsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,
  ) {}

  async getPaymentsOfProfessional(
    psychologistId: string,
  ): Promise<{ message: string; data: Payment[] }> {
    const payments = await this.paymentsRepository
      .createQueryBuilder('payment')
      .innerJoinAndSelect(
        'appointments',
        'appointment',
        'payment.appointment_id = appointment.id',
      )
      .where('appointment."psychologistId" = :psychologistId', {
        psychologistId,
      })
      .getMany();

    if (!payments || payments.length === 0) {
      throw new NotFoundException(
        'No se encontraron pagos para este psicólogo',
      );
    }

    return { message: 'Pagos recuperados exitosamente', data: payments };
  }
}
