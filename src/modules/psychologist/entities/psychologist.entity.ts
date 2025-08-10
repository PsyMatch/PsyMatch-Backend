import { Column, OneToMany, ChildEntity, ManyToMany } from 'typeorm';
import { EPsychologistSpecialty } from '../enums/specialities.enum';
import { ESessionType } from '../enums/session-types.enum';
import { ETherapyApproach } from '../enums/therapy-approaches.enum';
import { Reviews } from '../../reviews/entities/reviews.entity';
import { User } from '../../users/entities/user.entity';
import { ERole } from '../../../common/enums/role.enum';

@ChildEntity(ERole.PSYCHOLOGIST)
export class Psychologist extends User {
  @Column({ type: 'text', nullable: true })
  office_address: string;

  @Column({ type: 'text', nullable: true })
  personal_biography: string;

  @Column({ type: 'text', nullable: true })
  professional_experience: string;

  @Column({ type: 'text', nullable: true })
  languages: string;

  @Column({ type: 'text', nullable: true })
  name_of_company: string;

  @Column({ type: 'text', nullable: true })
  company_phone: string;

  @Column({ type: 'text', nullable: true })
  job_description: string;

  @Column({ type: 'text', unique: true, nullable: false })
  license_number: string;

  @Column({ type: 'text', unique: true, nullable: true })
  malpractice_insurance: string;

  @Column({
    type: 'enum',
    enum: EPsychologistSpecialty,
    array: true,
    nullable: false,
  })
  specialities: EPsychologistSpecialty[];

  @Column({
    type: 'enum',
    enum: ESessionType,
    array: true,
    nullable: true,
  })
  session_types: ESessionType[];

  @Column({
    type: 'enum',
    enum: ETherapyApproach,
    array: true,
    nullable: true,
  })
  therapy_approaches: ETherapyApproach[];

  @OneToMany(() => Reviews, (reviews) => reviews.psychologist)
  reviews: Reviews[];

  @ManyToMany(() => User, (patient) => patient.psychologists)
  patients: User[];
}
