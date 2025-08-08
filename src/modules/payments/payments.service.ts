import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
  ) {}

  async create(dto: CreatePaymentDto) {
    const payment = this.paymentRepo.create(dto);
    return await this.paymentRepo.save(payment);
  }

  async findAll() {
    return await this.paymentRepo.find({ relations: ['appointment'] });
  }

  async findOne(id: string) {
    const payment = await this.paymentRepo.findOne({
      where: { pay_id: id },
      relations: ['appointment'],
    });
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }

  async update(id: string, dto: UpdatePaymentDto) {
    await this.findOne(id);
    await this.paymentRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const payment = await this.findOne(id);
    return await this.paymentRepo.remove(payment);
  }
}
