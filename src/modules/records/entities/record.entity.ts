import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ETypeRecord } from '../enums/typeRecord.enum';

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

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'enum', enum: ETypeRecord })
  type: ETypeRecord;
}
