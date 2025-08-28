import { Module, OnModuleInit } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Psychologist } from '../psychologist/entities/psychologist.entity';
import { Patient } from '../users/entities/patient.entity';
import { Admin } from '../users/entities/admin.entity';
import { Reviews } from '../reviews/entities/reviews.entity';
import { Appointment } from '../appointments/entities/appointment.entity';
import { Payment } from '../payments/entities/payment.entity';
import { envs } from '../../configs/envs.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Patient,
      Admin,
      Psychologist,
      Reviews,
      Appointment,
      Payment,
    ]),
  ],
  providers: [SeederService],
})
export class SeederModule implements OnModuleInit {
  constructor(private readonly seederService: SeederService) {}

  async onModuleInit() {
    if (envs.server.environment !== 'production') {
      await this.seederService.seedUsers();
      await this.seederService.seedReviews();
      await this.seederService.seedAppointments();
      await this.seederService.seedPayments();
    }
  }
}
