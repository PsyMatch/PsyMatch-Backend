import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  TableInheritance,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ERole } from '../../../common/enums/role.enum';
import { EPsychologistStatus } from '../../psychologist/enums/verified.enum';

@Entity('users')
@TableInheritance({
  column: { type: 'enum', name: 'role', enum: ERole },
  pattern: 'STI',
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  phone: string;

  @Column({ type: 'text', nullable: true })
  birthdate: string;

  @Column({ type: 'bigint', unique: true, nullable: true })
  dni: number;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'text', unique: true, nullable: false })
  email: string;

  @Column({ type: 'text', nullable: true })
  password: string;

  @Column({ type: 'text', unique: true, nullable: true })
  social_security_number: string;

  @Column({ type: 'text', nullable: true })
  emergency_contact: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ type: 'text', nullable: true })
  profile_picture: string;

  @ManyToMany(() => User, { cascade: true })
  @JoinTable({
    name: 'patient_psychologists',
    joinColumn: { name: 'patient_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'psychologist_id', referencedColumnName: 'id' },
  })
  psychologists: User[];

  @Column({
    type: 'enum',
    enum: ERole,
    nullable: false,
    default: ERole.PATIENT,
  })
  role: ERole;

  @Column({
    type: 'enum',
    enum: EPsychologistStatus,
    nullable: true,
  })
  verified: EPsychologistStatus | null;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'timestamp', nullable: true })
  last_login: Date;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ type: 'text', nullable: true })
  provider: string;

  @Column({ type: 'text', nullable: true })
  provider_id: string;
}
