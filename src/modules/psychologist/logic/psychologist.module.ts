import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import { Psychologist } from '../entities/psychologist.entity';
import { JwtService } from '@nestjs/jwt';
import { VerificationPsychologistController } from './verificationOfProfessionals/verificationPsychologist.controller';
import { VerificationPsychologistService } from './verificationOfProfessionals/verificationPsychologist.service';
import { ReviewsOfProfessionalsController } from './reviewsOfProfessionals/reviewsOfProfessionals.controller';
import { ProfileManagementController } from './profileManagement/profileManagement.controller';
import { PaymentsOfProfessionalsController } from './paymentsOfProfessionals/paymentsOfProfessionals.controller';
import { PatientsOfProfessionalController } from './patientsOfProfessional/patientsOfProfessional.controller';
import { AppointmentsOfProfessionalController } from './appointmentsOfProfessional/appointmentsOfProfessional.controller';
import { ReviewsProfessionalsService } from './reviewsOfProfessionals/reviewsOfProfessionals.service';
import { ProfileService } from './profileManagement/profileManagement.service';
import { PaymentsOfProfessionalsService } from './paymentsOfProfessionals/paymentsOfProfessionals.service';
import { PatientsOfProfessionalService } from './patientsOfProfessional/patientsOfProfessional.service';
import { AppointmentsOfProfessionalService } from './appointmentsOfProfessional/appointmentsOfProfessional.service';
import { Appointment } from '../../../modules/appointments/entities/appointment.entity';
import { Payment } from '../../../modules/payments/entities/payment.entity';
import { Reviews } from '../../../modules/reviews/entities/reviews.entity';
import { PaginationService } from '../../../common/services/pagination.service';
import { FilesModule } from '../../files/files.module';

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
  controllers: [
    VerificationPsychologistController,
    ReviewsOfProfessionalsController,
    ProfileManagementController,
    PaymentsOfProfessionalsController,
    PatientsOfProfessionalController,
    AppointmentsOfProfessionalController,
  ],
  providers: [
    PaginationService,
    JwtService,
    VerificationPsychologistService,
    ReviewsProfessionalsService,
    ProfileService,
    PaymentsOfProfessionalsService,
    PatientsOfProfessionalService,
    AppointmentsOfProfessionalService,
  ],
  exports: [VerificationPsychologistService],
})
export class PsychologistModule {}
