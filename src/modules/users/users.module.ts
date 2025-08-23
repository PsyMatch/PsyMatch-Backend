import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { Patient } from './entities/patient.entity';
import { Psychologist } from '../psychologist/entities/psychologist.entity';
import { JwtService } from '@nestjs/jwt';
import { FilesModule } from '../files/files.module';
import { PaginationService } from '../../common/services/pagination.service';
import { Payment } from '../payments/entities/payment.entity';
import { Appointment } from '../appointments/entities/appointment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Patient,
      Psychologist,
      Appointment,
      Payment,
    ]),
    FilesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtService, PaginationService],
  exports: [UsersService],
})
export class UsersModule {}
