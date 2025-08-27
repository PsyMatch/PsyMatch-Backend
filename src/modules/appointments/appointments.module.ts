import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { Appointment } from './entities/appointment.entity';
import { User } from '../users/entities/user.entity';
import { Psychologist } from '../psychologist/entities/psychologist.entity';
import { AuthModule } from '../auth/auth.module';
import { EmailsModule } from '../emails/emails.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ReminderService } from './crons/reminder.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Appointment, User, Psychologist]),
    AuthModule,
    EmailsModule,
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService, ReminderService],
  exports: [TypeOrmModule.forFeature([Appointment])],
})
export class AppointmentsModule {}
