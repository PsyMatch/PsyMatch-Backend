import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { Psychologist } from '../psychologist/entities/psychologist.entity';
import { Reviews } from './entities/reviews.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Appointment } from '../appointments/entities/appointment.entity';
import { User } from '../users/entities/user.entity';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService, JwtService],
  imports: [
    TypeOrmModule.forFeature([Reviews, Psychologist, Appointment, User]),
  ],
})
export class ReviewsModule {}
