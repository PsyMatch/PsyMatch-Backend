import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../../../../modules/appointments/entities/appointment.entity';

@Injectable()
export class AppointmentsOfProfessionalService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentsRepository: Repository<Appointment>,
  ) {}

  async getAppointmentsOfProfessional(psychoId: string) {
    const appointments = await this.appointmentsRepository.find({
      where: { psychologist: { id: psychoId } },
      relations: ['patient'],
    });

    if (!appointments || appointments.length === 0) {
      throw new NotFoundException(
        'No se encontraron pacientes o turnos de este psicologo',
      );
    }

    return appointments;
  }
}
