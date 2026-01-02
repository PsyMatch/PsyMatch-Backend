import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Appointment } from '../appointments/entities/appointment.entity';
import { Reviews } from '../reviews/entities/reviews.entity';
import { Payment } from '../payments/entities/payment.entity';
import { Psychologist } from '../psychologist/entities/psychologist.entity';
import { AuthModule } from '../auth/auth.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PaginationService } from 'src/common/services/pagination.service';
import { EmailsService } from '../emails/emails.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Appointment,
      Reviews,
      Payment,
      Psychologist,
    ]),
    AuthModule,
  ],
  controllers: [AdminController],
  providers: [AdminService, PaginationService, EmailsService],
})
export class AdminModule {}
