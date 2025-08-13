import { Injectable, NotFoundException } from '@nestjs/common';
import { AppointmentsOfProfessionalService } from '../appointmentsOfProfessional/appointmentsOfProfessional.service';

@Injectable()
export class PatientsOfProfessionalService {
  constructor(
    private readonly appointmentsService: AppointmentsOfProfessionalService,
  ) {}

  async getPatientsForPsychologist(userId: string) {
    const appointments =
      await this.appointmentsService.getAppointmentsOfProfessional(userId);

    if (!appointments || appointments.length === 0) {
      throw new NotFoundException(
        'No hay citas disponibles para este psicólogo',
      );
    }

    const patients = appointments.map((appointment) => appointment.user);

    if (!patients.length) {
      throw new NotFoundException(
        'No hay pacientes disponibles para este psicólogo',
      );
    }

    return patients;
  }
}
