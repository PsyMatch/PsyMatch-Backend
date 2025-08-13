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

  async getPaymentsOfProfessional(psychologistId: string) {
    const payments = await this.paymentsRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.appointment', 'appointment')
      .leftJoinAndSelect('appointment.psychologist', 'psychologist')
      .where('psychologist.id = :psychologistId', { psychologistId })
      .getMany();

    if (!payments || payments.length === 0) {
      throw new NotFoundException(
        'No se encontraron pagos para este psicólogo',
      );
    }

    return payments;
  }
}
