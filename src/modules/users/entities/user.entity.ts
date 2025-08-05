import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ERole } from '../enums/role.enum';
import { Psychologist } from 'src/modules/psychologist/entities/psychologist.entity';
import { Reviews } from 'src/modules/reviews/entities/reviews.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  profile_picture: string;

  @Column({ type: 'bigint' })
  phone: number;

  @Column({ type: 'text' })
  address: string;

  @Column({ type: 'text' })
  email: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ type: 'enum' })
  role: ERole;

  @ManyToOne(() => Psychologist, (psychologist) => psychologist.users)
  professionals: Psychologist;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp' })
  last_login: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @OneToMany(() => Reviews, (reviews) => reviews.user)
  reviews: Reviews[];
}
