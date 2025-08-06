import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { Psychologist } from '../psychologist/entities/psychologist.entity';
import { Reviews } from './entities/reviews.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService],
  imports: [TypeOrmModule.forFeature([Reviews, Psychologist])],
})
export class ReviewsModule {}
