import { Column, OneToMany, ChildEntity } from 'typeorm';
import { EPsychologistSpecialty } from '../enums/specialities.enum';
import { ESessionType } from '../enums/session-types.enum';
import { ETherapyApproach } from '../enums/therapy-approaches.enum';
import { Reviews } from '../../reviews/entities/reviews.entity';
import { User } from '../../users/entities/user.entity';
import { ERole } from '../../../common/enums/role.enum';
import { ELanguage } from '../enums/languages.enum';
import { EModality } from '../enums/modality.enum';
import { EPsychologistStatus } from '../enums/verified.enum';
import { EInsurance } from '../../users/enums/insurances .enum';
import { EAvailability } from '../enums/availability.enum';

@ChildEntity(ERole.PSYCHOLOGIST)
export class Psychologist extends User {
  @Column({ type: 'text', nullable: true })
  personal_biography: string;

  @Column({ type: 'enum', enum: ELanguage, array: true, nullable: true })
  languages: ELanguage[];

  @Column({ type: 'int', nullable: true })
  professional_experience: number;

  @Column({ type: 'bigint', unique: true, nullable: true })
  license_number: number;

  @Column({
    type: 'enum',
    enum: EPsychologistStatus,
    nullable: true,
  })
  verified: EPsychologistStatus | null;

  @Column({ type: 'text', nullable: true })
  office_address: string;

  @Column({
    type: 'enum',
    enum: EPsychologistSpecialty,
    array: true,
    nullable: false,
  })
  specialities: EPsychologistSpecialty[];

  @Column({
    type: 'enum',
    enum: ETherapyApproach,
    array: true,
    nullable: true,
  })
  therapy_approaches: ETherapyApproach[];

  @Column({
    type: 'enum',
    enum: ESessionType,
    array: true,
    nullable: true,
  })
  session_types: ESessionType[];

  @Column({
    type: 'enum',
    enum: EModality,
    nullable: true,
  })
  modality: EModality;

  @Column({ type: 'enum', enum: EInsurance, array: true, nullable: true })
  insurance_accepted: EInsurance[];

  @Column({ type: 'enum', enum: EAvailability, array: true, nullable: true })
  availability: EAvailability[];

  @OneToMany(() => Reviews, (reviews) => reviews.psychologist)
  reviews: Reviews[];

  @Column({ type: 'text', nullable: false })
  professional_title: string;
}
