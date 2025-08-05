import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { PsychologistSpecialty } from '../enums/specialities.enum';
import { Reviews } from 'src/modules/reviews/entities/reviews.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Entity('psychologist')
export class Psychologist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  office_address: string;

  @Column()
  verified: boolean;

  @Column({ type: 'text', nullable: false })
  license_number: string;

  @Column({ type: 'enum', enum: PsychologistSpecialty, nullable: false })
  specialities: PsychologistSpecialty[];

  @OneToMany(() => Reviews, (reviews) => reviews.psychologist)
  reviews: Reviews[];

  @OneToMany(() => User, (user) => user.professionals)
  users: User[];
}
