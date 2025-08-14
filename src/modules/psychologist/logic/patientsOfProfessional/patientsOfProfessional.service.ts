import { Injectable, NotFoundException } from '@nestjs/common';
import { AppointmentsOfProfessionalService } from '../appointmentsOfProfessional/appointmentsOfProfessional.service';
import { ResponseUserDto } from 'src/modules/users/dto/response-user.dto';

@Injectable()
export class PatientsOfProfessionalService {
  constructor(
    private readonly appointmentsService: AppointmentsOfProfessionalService,
  ) {}

  async getPatientsForPsychologist(
    userId: string,
  ): Promise<{ message: string; data: ResponseUserDto[] }> {
    const appointments =
      await this.appointmentsService.getAppointmentsOfProfessional(userId);

    const { data } = appointments;

    if (!data || data.length === 0) {
      throw new NotFoundException(
        'No hay citas disponibles para este psicólogo',
      );
    }

    const patients = data.map((appointment) => appointment.patient);

    if (!patients.length) {
      throw new NotFoundException(
        'No hay pacientes disponibles para este psicólogo',
      );
    }

    return { message: 'Pacientes recuperados exitosamente', data: patients };
  }
}
