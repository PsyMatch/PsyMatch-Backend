import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './modules/database/database.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { PsychologistModule } from './modules/psychologist/logic/psychologist.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { AuthModule } from './modules/auth/auth.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { UtilsModule } from './modules/utils/utils.module';
import { SeederModule } from './modules/seeder/seeder.module';
import { AdminDashboardModule } from './modules/admin/adminDashboard.module';
import { EmailsModule } from './modules/emails/emails.module';

@Module({
  imports: [
    DatabaseModule,
    UtilsModule,
    AuthModule,
    UsersModule,
    ReviewsModule,
    // RecordsModule, NO NECESARIO EN ESTE MOMENTO
    PsychologistModule,
    PaymentsModule,
    AppointmentsModule,
    SeederModule,
    AdminDashboardModule,
    EmailsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
