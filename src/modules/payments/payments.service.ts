import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PayStatus } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,
  ) {}

  async create(dto: CreatePaymentDto): Promise<Payment> {
    const payment = this.paymentsRepository.create(dto);

    try {
      return await this.paymentsRepository.save(payment);
    } catch {
      payment.pay_status = PayStatus.FAILED;
      return await this.paymentsRepository.save(payment);
    }
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentsRepository.find();
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne({
      where: { payment_id: id },
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return payment;
  }

  async update(id: string, dto: UpdatePaymentDto): Promise<Payment> {
    const payment = await this.findOne(id);

    if (dto.appointment_id) payment.appointment_id = dto.appointment_id;
    if (dto.amount) payment.amount = dto.amount;
    if (dto.currency) payment.currency = dto.currency;
    if (dto.pay_method) payment.pay_method = dto.pay_method;
    if (dto.pay_status) payment.pay_status = dto.pay_status;
    if (dto.notes) payment.notes = dto.notes;
    if (dto.refund_amount) payment.refund_amount = dto.refund_amount;

    return this.paymentsRepository.save(payment);
  }

  async remove(id: string): Promise<void> {
    const result = await this.paymentsRepository.delete({ payment_id: id });

    if (result.affected === 0) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
  }
}
