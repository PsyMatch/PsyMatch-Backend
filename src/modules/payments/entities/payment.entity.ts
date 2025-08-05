import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Appointment } from 'src/appointments/entities/appointment.entity';

export enum PayMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  PAYPAL = 'PAYPAL',
  TRANSFER = 'TRANSFER',
}

export enum PayStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  pay_id: string;

  @ManyToOne(() => Appointment)
  appointment: Appointment;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: PayMethod,
  })
  pay_method: PayMethod;

  @Column({
    type: 'enum',
    enum: PayStatus,
    default: PayStatus.PENDING,
  })
  pay_status: PayStatus;

  @CreateDateColumn()
  pay_date: Date;
}
