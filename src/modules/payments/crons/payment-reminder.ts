import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../../appointments/entities/appointment.entity';
import { Payment, PayStatus } from '../entities/payment.entity';
import { EmailsService } from '../../emails/emails.service';
import { AppointmentStatus } from 'src/modules/appointments/enums/appointment-status.enum';
import { Patient } from 'src/modules/users/entities/patient.entity';

@Injectable()
export class PaymentReminderCron {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,
    private readonly emailsService: EmailsService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async sendPaymentReminders() {
    const now = new Date();
    const in48Hours = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    const appointments = await this.appointmentRepo.find({
      where: {
        date: in48Hours,
        status: AppointmentStatus.PENDING_PAYMENT,
      },
      relations: ['user'],
    });

    for (const appointment of appointments) {
      const payment = await this.paymentRepo.findOne({
        where: {
          appointment_id: appointment.id,
          pay_status: PayStatus.COMPLETED,
        },
      });
      if (!payment) {
        const patient = appointment.patient;
        if (patient) {
          await this.emailsService.sendPendingPaymentEmail(patient.email);
        }
      }
    }
  }
}
