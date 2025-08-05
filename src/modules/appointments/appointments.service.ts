import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
  ) {}

  async create(dto: CreateAppointmentDto) {
    const appointment = this.appointmentRepo.create(dto);
    return await this.appointmentRepo.save(appointment);
  }

  async findAll() {
    return await this.appointmentRepo.find({
      relations: ['user', 'psychologist'],
    });
  }

  async findOne(id: string) {
    const appointment = await this.appointmentRepo.findOne({
      where: { appointment_id: id },
      relations: ['user', 'psychologist'],
    });
    if (!appointment) throw new NotFoundException('Appointment not found');
    return appointment;
  }

  async update(id: string, dto: UpdateAppointmentDto) {
    await this.findOne(id);
    await this.appointmentRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const appointment = await this.findOne(id);
    return await this.appointmentRepo.remove(appointment);
  }
}
