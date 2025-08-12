import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Psychologist } from '../../psychologist/entities/psychologist.entity';
import { User } from '../../users/entities/user.entity';
import { EModality } from 'src/modules/psychologist/enums/modality.enum';
import { Payment } from '../../payments/entities/payment.entity';

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  appointment_id: string;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Psychologist)
  psychologist: Psychologist;

  @OneToMany(() => Payment, (payment) => payment.appointment)
  payments: Payment[];

  @Column({ type: 'date' })
  date: string;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.PENDING,
  })
  status: AppointmentStatus;

  @Column({
    type: 'enum',
    enum: EModality,
    default: EModality.ONLINE,
  })
  modality: EModality;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
