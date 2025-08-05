import { Psychologist } from 'src/modules/psychologist/entities/psychologist.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity('reviews')
export class Reviews {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  rating: number;

  @Column({ type: 'text', nullable: false })
  comment: string;

  @Column({ type: 'date', nullable: false })
  review_date: Date;

  @ManyToOne(() => User, (user) => user.reviews)
  user: User;

  @ManyToOne(() => Psychologist, (psychologist) => psychologist.reviews)
  psychologist: Psychologist;
}
