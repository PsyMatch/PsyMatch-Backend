import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { PsychologistProfile } from 'src/psychologist/entities/psychologist-profile.entity';

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export enum Modality {
  ONLINE = 'ONLINE',
  IN_PERSON = 'IN_PERSON',
}

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  appointment_id: string;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => PsychologistProfile)
  psychologist: PsychologistProfile;

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
    enum: Modality,
    default: Modality.ONLINE,
  })
  modality: Modality;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
