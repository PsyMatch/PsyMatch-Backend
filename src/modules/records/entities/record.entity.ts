import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { ETypeRecord } from '../enums/typeRecord.enum';
import { User } from '../../users/entities/user.entity';
import { Psychologist } from '../../psychologist/entities/psychologist.entity';

@Entity('records')
export class Record {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  psychologist_id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'enum', enum: ETypeRecord })
  type: ETypeRecord;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Psychologist)
  @JoinColumn({ name: 'psychologist_id' })
  psychologist: Psychologist;
}
