import { ChildEntity, Column, OneToMany } from 'typeorm';
import { ERole } from '../../../common/enums/role.enum';
import { User } from './user.entity';
import { EInsurance } from '../enums/insurances.enum';
import { Appointment } from '../../appointments/entities/appointment.entity';

@ChildEntity(ERole.PATIENT)
export class Patient extends User {
  @Column({ type: 'text', nullable: true })
  alias: string;

  @Column({ type: 'text', nullable: false })
  address: string;

  @Column({ type: 'enum', enum: EInsurance, nullable: true })
  health_insurance: EInsurance;

  @Column({ type: 'text', nullable: true })
  emergency_contact: string;

  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  appointments: Appointment[];

  @Column({ type: 'boolean', default: true })
  reminder_sent: boolean;
}
