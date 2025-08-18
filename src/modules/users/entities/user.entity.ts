import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  TableInheritance,
} from 'typeorm';
import { ERole } from '../../../common/enums/role.enum';

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

  @Column({ type: 'date', nullable: true })
  birthdate: Date;

  @Column({ type: 'bigint', unique: true, nullable: true })
  dni: number;

  @Column({ type: 'text', unique: true, nullable: false })
  email: string;

  @Column({ type: 'text', nullable: true })
  password: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ type: 'text', nullable: true })
  profile_picture: string;

  @Column({
    type: 'enum',
    enum: ERole,
    nullable: false,
    default: ERole.PATIENT,
  })
  role: ERole;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  last_login: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ type: 'text', nullable: true })
  provider: string;

  @Column({ type: 'text', nullable: true })
  provider_id: string;
}
