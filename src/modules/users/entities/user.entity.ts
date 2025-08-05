import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ERole } from '../enums/role.enum';
import { Psychologist } from '../../psychologist/entities/psychologist.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  profile_picture: string;

  @Column({ type: 'bigint', nullable: true })
  phone: number;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'text', unique: true, nullable: false })
  email: string;

  @Column({ type: 'text', nullable: false })
  password: string;

  @Column({
    type: 'enum',
    enum: ERole,
    nullable: false,
    default: ERole.PATIENT,
  })
  role: ERole;

  @ManyToOne(() => Psychologist, { nullable: true })
  @JoinColumn({ name: 'professionals' })
  professionals: Psychologist[];

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'timestamp', nullable: true })
  last_login: Date;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
