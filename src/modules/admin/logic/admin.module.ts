import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from '../../appointments/entities/appointment.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { Reviews } from '../../reviews/entities/reviews.entity';
import { User } from '../../users/entities/user.entity';
import { Psychologist } from '../../psychologist/entities/psychologist.entity';
import { PaginationService } from '../../../common/services/pagination.service';
import { AdminDashboardController } from './adminDashBoard/adminDashboard.controller';
import { AdminDashboardService } from './adminDashBoard/adminDashboard.service';
import { AdminController } from './adminEndpoints/admin.controller';
import { AdminService } from './adminEndpoints/admin.service';
import { AuthModule } from '../../auth/auth.module';
import { ReportsService } from './reports/reports.service';
import { ReportsController } from './reports/reports.controller';
import { EmailsService } from '../../emails/emails.service';

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
  controllers: [AdminDashboardController, AdminController, ReportsController],
  providers: [
    AdminDashboardService,
    AdminService,
    PaginationService,
    ReportsService,
    EmailsService,
  ],
})
export class AdminModule {}
