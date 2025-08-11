import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Psychologist } from '../../psychologist/entities/psychologist.entity';
import { User } from '../../users/entities/user.entity';
import { EModality } from 'src/modules/psychologist/enums/modality.enum';

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
