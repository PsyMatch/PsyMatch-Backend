import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Appointment } from '../entities/appointment.entity';
import { EmailsService } from '../../emails/emails.service';

@Injectable()
export class ReminderService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    private readonly emailsService: EmailsService,
  ) {}

  @Cron('0 * * * *')
  async sendAppointmentReminders() {
    const now = new Date();
    const target = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const start = new Date(target.getTime() - 30 * 60 * 1000);
    const end = new Date(target.getTime() + 30 * 60 * 1000);

    const appointments = await this.appointmentRepository.find({
      where: {
        date: Between(start, end),
      },
      relations: ['patient'],
    });

    for (const appointment of appointments) {
      if (appointment.patient.reminder_sent) {
        await this.emailsService.sendAppointmentReminderEmail(
          appointment.patient.email,
          appointment,
        );
      }

      await this.appointmentRepository.save(appointment);
    }
  }
}
