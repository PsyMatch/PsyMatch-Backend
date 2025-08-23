import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminDashboardController } from './adminDashboard.controller';
import { User } from '../users/entities/user.entity';
import { Appointment } from '../appointments/entities/appointment.entity';
import { Reviews } from '../reviews/entities/reviews.entity';
import { Payment } from '../payments/entities/payment.entity';
import { AdminDashboardService } from './adminDashboard.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User, Appointment, Reviews, Payment])],
  controllers: [AdminDashboardController],
  providers: [AdminDashboardService, JwtService],
})
export class AdminDashboardModule {}
