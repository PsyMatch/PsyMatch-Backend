import { Column, OneToMany, ChildEntity } from 'typeorm';
import { PsychologistSpecialty } from '../enums/specialities.enum';
import { Reviews } from '../../reviews/entities/reviews.entity';
import { User } from '../../users/entities/user.entity';
import { PsychologistStatus } from '../enums/verified.enum';
import { ERole } from 'src/common/enums/role.enum';

@ChildEntity(ERole.PSYCHOLOGIST)
export class Psychologist extends User {
  @Column({ type: 'text', nullable: true })
  office_address: string;

  @Column({
    type: 'enum',
    enum: PsychologistStatus,
    default: PsychologistStatus.PENDING,
  })
  verified: PsychologistStatus;

  @Column({ type: 'text', nullable: false })
  license_number: string;

  @Column({ type: 'enum', enum: PsychologistSpecialty, nullable: false })
  specialities: PsychologistSpecialty[];

  @OneToMany(() => Reviews, (reviews) => reviews.psychologist)
  reviews: Reviews[];

  @OneToMany(() => User, (user) => user.professionals)
  users: User[];
}
