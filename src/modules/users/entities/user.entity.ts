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

@Entity('users')
@TableInheritance({
  column: { type: 'text', name: 'type' },
  pattern: 'STI',
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  profile_picture: string;

  @Column({ type: 'text', nullable: true })
  phone: string;

  @Column({ type: 'text', nullable: true })
  birthdate: string;

  @Column({ type: 'bigint', unique: true, nullable: false })
  dni: number;

  @Column({ type: 'text', unique: true, nullable: false })
  social_security_number: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ type: 'text', unique: true, nullable: false })
  email: string;

  @Column({ type: 'text', nullable: false })
  password: string;

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

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'timestamp', nullable: true })
  last_login: Date;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  // CODIGO ESCRITO POR PEDRO, NECESARIO PARA LA AUTENTICACION DE TERCEROS
  @Column({ type: 'text', nullable: true })
  provider: string;

  @Column({ type: 'text', nullable: true })
  provider_id: string;
}
