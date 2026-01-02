import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PsychologistController } from './psychologist.controller';
import { PsychologistService } from './psychologist.service';
import { User } from '../users/entities/user.entity';
import { Psychologist } from './entities/psychologist.entity';
import { Appointment } from '../appointments/entities/appointment.entity';
import { Payment } from '../payments/entities/payment.entity';
import { Reviews } from '../reviews/entities/reviews.entity';
import { PaginationService } from 'src/common/services/pagination.service';
import { FilesModule } from '../files/files.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Psychologist,
      Appointment,
      Payment,
      Reviews,
      PaginationService,
    ]),
    FilesModule,
  ],
  controllers: [PsychologistController],
  providers: [PaginationService, JwtService, PsychologistService],
  exports: [PsychologistService],
})
export class PsychologistModule {}
