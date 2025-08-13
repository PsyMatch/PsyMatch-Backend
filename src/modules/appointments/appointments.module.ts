import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { Appointment } from './entities/appointment.entity';
import { User } from '../users/entities/user.entity';
import { Psychologist } from '../psychologist/entities/psychologist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, User, Psychologist])],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}
