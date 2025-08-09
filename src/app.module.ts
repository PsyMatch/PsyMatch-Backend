import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { RecordsModule } from './modules/records/records.module';
import { DatabaseModule } from './modules/database/database.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { PsychologistModule } from './modules/psychologist/psychologist.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { AuthModule } from './modules/auth/auth.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { UtilsModule } from './modules/utils/utils.module';
import { FilesModule } from './modules/files/files.module';
import { SeederModule } from './modules/seeder/seeder.module';

@Module({
  imports: [
    DatabaseModule,
    UtilsModule,
    AuthModule,
    UsersModule,
    FilesModule,
    ReviewsModule,
    RecordsModule,
    PsychologistModule,
    PaymentsModule,
    AppointmentsModule,
    SeederModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
