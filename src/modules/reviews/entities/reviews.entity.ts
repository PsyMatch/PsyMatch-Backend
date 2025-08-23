import { Psychologist } from '../../psychologist/entities/psychologist.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity('reviews')
export class Reviews {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', nullable: false })
  rating: number;

  @Column({ type: 'text', nullable: false })
  comment: string;

  @Column({ type: 'date', nullable: false })
  review_date: Date;

  @Column({ type: 'uuid', nullable: false })
  userId: string;
  
  @ManyToOne(() => Psychologist, (psychologist) => psychologist.reviews)
  psychologist: Psychologist;
}
