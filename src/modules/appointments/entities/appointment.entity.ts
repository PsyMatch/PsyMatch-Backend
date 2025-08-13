import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { EModality } from '../../psychologist/enums/modality.enum';

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

  @ManyToOne(() => User, (user) => user.appointments, {
    onDelete: 'CASCADE',
    eager: true,
  })
  user: User;

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
