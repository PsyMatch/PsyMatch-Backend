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
  MERCADO_PAGO = 'MERCADO_PAGO',
}

export enum PayStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  payment_id: string;

  @Column({ type: 'uuid', nullable: true })
  appointment_id: string;

  @Column({ type: 'uuid', nullable: true })
  user_id: string;

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

  // Campos específicos para MercadoPago
  @Column({ nullable: true })
  mercado_pago_id?: string;

  @Column({ nullable: true })
  preference_id?: string;

  @Column({ nullable: true })
  payer_email?: string;

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
