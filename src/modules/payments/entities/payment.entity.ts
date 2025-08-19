import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PayMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  PAYPAL = 'PAYPAL',
  BANK_TRANSFER = 'BANK_TRANSFER',
}

export enum PayStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  payment_id: string;

  @Column({ type: 'uuid' })
  appointment_id: string;

  // DESCOMENTAR CUANDO ESTE LA RELACION EN APPOINTMENTS
  // @ManyToOne(() => Appointment, (appointment) => appointment.payments, {
  //   onDelete: 'CASCADE',
  // })
  // @JoinColumn({ name: 'appointment_id' })
  // appointment: Appointment;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 3, default: 'USD' })
  currency: string;

  @Column({ type: 'enum', enum: PayMethod })
  pay_method: PayMethod;

  @Column({ nullable: true })
  notes?: string;

  @Column({ type: 'decimal', nullable: true })
  refund_amount?: number;

  @Column({
    type: 'enum',
    enum: PayStatus,
    default: PayStatus.PENDING,
  })
  pay_status: PayStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
