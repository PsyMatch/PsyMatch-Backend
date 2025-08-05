import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { PsychologistModule } from './modules/psychologist/psychologist.module';
import { AuthModule } from './modules/auth/auth.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';

@Module({
  imports: [
    UsersModule,
    ReviewsModule,
    PsychologistModule,
    AuthModule,
    PaymentsModule,
    AppointmentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
