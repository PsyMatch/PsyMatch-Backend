import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Psychologist } from '../../psychologist/entities/psychologist.entity';
import { AppointmentStatus } from '../enums/appointment-status.enum';
import { EModality } from '../../psychologist/enums/modality.enum';
import { Patient } from '../../users/entities/patient.entity';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamptz' })
  date: Date;

  @Column({ type: 'int', nullable: true })
  duration: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @ManyToOne(() => Patient, (patient) => patient.appointments, {
    onDelete: 'CASCADE',
    eager: true,
  })
  patient: Patient;

  @ManyToOne(() => Psychologist, (psychologist) => psychologist.appointments, {
    onDelete: 'CASCADE',
    eager: true,
  })
  psychologist: Psychologist;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.PENDING,
  })
  status: AppointmentStatus;

  @Column({ type: 'enum', enum: EModality })
  modality: EModality;
}
