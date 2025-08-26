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

  @Column({ type: 'varchar', length: 5 })
  hour: string; 

  @Column({ type: 'int', nullable: true, default: 45 })
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
    default: AppointmentStatus.PENDING_PAYMENT,
  })
  status: AppointmentStatus;

  @Column({ type: 'enum', enum: EModality })
  modality: EModality;

  // Campos solicitados en notas
  @Column({ type: 'varchar', length: 50, nullable: true })
  session_type: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  therapy_approach: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  insurance: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
