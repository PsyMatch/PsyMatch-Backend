import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from 'src/modules/appointments/entities/appointment.entity';
import { Repository } from 'typeorm/repository/Repository';
import { WeeklyReportDataDTO } from '../../DTOs/weekly-report-data.dto';
import { Payment } from 'src/modules/payments/entities/payment.entity';
import { WeeklyPaymentReportDTO } from '../../DTOs/weekly-payment-report.dto';
import { User } from 'src/modules/users/entities/user.entity';
import { MonthlyUserReportDTO } from '../../DTOs/monthly-user-report.dto';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async generateAppointmentsReport(): Promise<WeeklyReportDataDTO[]> {
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const appointmentsByWeek = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .select([
        "TO_CHAR(DATE_TRUNC('week', appointment.date), 'IYYY-\"W\"IW') AS week",
        'COUNT(*)::int AS confirmed_appointments',
      ])
      .where('appointment.date >= :twoWeeksAgo', { twoWeeksAgo })
      .andWhere("appointment.status IN ('confirmed', 'completed')")
      .groupBy('week')
      .orderBy('week', 'DESC')
      .getRawMany<WeeklyReportDataDTO>();

    this.logger.log(
      `Reporte de citas confirmadas de las últimas 2 semanas generado: ${appointmentsByWeek.length} semanas de datos`,
    );

    return appointmentsByWeek;
  }

  @Cron('0 7 * * 1', {
    name: 'weekly-appointment-report',
    timeZone: 'America/Argentina/Buenos_Aires',
  })
  async handleWeeklyReport() {
    this.logger.log(
      '🕐 Iniciando generación automática de reporte semanal de citas...',
    );

    try {
      const report = await this.generateAppointmentsReport();
      this.logger.log('✅ Reporte semanal de citas generado exitosamente.0');
      this.logger.debug(
        '📊 Datos del reporte:',
        JSON.stringify(report, null, 2),
      );
    } catch (error) {
      this.logger.error(
        '❌ Error al generar el reporte semanal de citas:',
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  async triggerWeeklyReport() {
    this.logger.log('🔧 Ejecutando reporte semanal manualmente...');

    try {
      const report = await this.generateAppointmentsReport();
      this.logger.log('✅ Reporte manual de citas generado exitosamente.');
      return report;
    } catch (error) {
      this.logger.error(
        '❌ Error al generar el reporte manual de citas:',
        error,
      );
      throw error;
    }
  }

  async generatePaymentsReport(): Promise<WeeklyPaymentReportDTO[]> {
    const sixWeeksAgo = new Date();
    sixWeeksAgo.setDate(sixWeeksAgo.getDate() - 42); // 6 weeks = 42 days

    const paymentsByWeek = await this.paymentRepository
      .createQueryBuilder('payment')
      .select([
        "TO_CHAR(DATE_TRUNC('week', payment.created_at), 'IYYY-\"W\"IW') AS week",
        'SUM(payment.amount) AS total_payments',
        'SUM(payment.amount) AS total_revenue',
        'AVG(payment.amount) AS average_payment',
      ])
      .where('payment.created_at >= :sixWeeksAgo', { sixWeeksAgo })
      .andWhere("payment.pay_status = 'COMPLETED'")
      .groupBy('week')
      .orderBy('week', 'ASC')
      .getRawMany<WeeklyPaymentReportDTO>();

    this.logger.log(
      `Weekly payments report generated: ${paymentsByWeek.length} weeks of data`,
    );

    return paymentsByWeek;
  }

  @Cron('0 8 * * 1', {
    name: 'weekly-payment-report',
    timeZone: 'America/Argentina/Buenos_Aires',
  })
  async handleWeeklyPaymentReport() {
    this.logger.log(
      '🕐 Iniciando generación automática de reporte semanal de pagos...',
    );

    try {
      const report = await this.generatePaymentsReport();
      this.logger.log('✅ Reporte semanal de pagos generado exitosamente.');
      this.logger.debug(
        '📊 Datos del reporte:',
        JSON.stringify(report, null, 2),
      );
    } catch (error) {
      this.logger.error(
        '❌ Error al generar el reporte semanal de pagos:',
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  async triggerWeeklyPaymentReport() {
    this.logger.log('🔧 Ejecutando reporte semanal de pagos manualmente...');

    try {
      const report = await this.generatePaymentsReport();
      this.logger.log('✅ Reporte manual de pagos generado exitosamente.');
      return report;
    } catch (error) {
      this.logger.error(
        '❌ Error al generar el reporte manual de pagos:',
        error,
      );
      throw error;
    }
  }

  async generateUsersReport(): Promise<MonthlyUserReportDTO[]> {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const usersByMonth = await this.userRepository
      .createQueryBuilder('user')
      .select([
        "TO_CHAR(DATE_TRUNC('month', user.created_at), 'YYYY-MM') AS month",
        'COUNT(*)::int AS total_new_users',
        "COUNT(CASE WHEN user.role = 'patient' THEN 1 END)::int AS new_patients",
        "COUNT(CASE WHEN user.role = 'psychologist' THEN 1 END)::int AS new_psychologists",
      ])
      .where('user.created_at >= :oneMonthAgo', { oneMonthAgo })
      .groupBy('month')
      .orderBy('month', 'DESC')
      .getRawMany<MonthlyUserReportDTO>();

    this.logger.log(
      `Reporte de usuarios registrados del último mes generado: ${usersByMonth.length} meses de datos`,
    );

    return usersByMonth;
  }

  @Cron('0 9 1 * *', {
    name: 'monthly-user-report',
    timeZone: 'America/Argentina/Buenos_Aires',
  })
  async handleMonthlyUserReport() {
    this.logger.log(
      '👥 Iniciando generación automática de reporte mensual de usuarios...',
    );

    try {
      const report = await this.generateUsersReport();
      this.logger.log('✅ Reporte mensual de usuarios generado exitosamente.');
      this.logger.debug(
        '📊 Datos del reporte:',
        JSON.stringify(report, null, 2),
      );
    } catch (error) {
      this.logger.error(
        '❌ Error al generar el reporte mensual de usuarios:',
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  async triggerMonthlyUserReport(): Promise<MonthlyUserReportDTO[]> {
    this.logger.log('👥 Ejecutando reporte mensual de usuarios manualmente...');

    try {
      const report = await this.generateUsersReport();
      this.logger.log('✅ Reporte manual de usuarios generado exitosamente.');
      return report;
    } catch (error) {
      this.logger.error(
        '❌ Error al generar el reporte manual de usuarios:',
        error instanceof Error ? error.message : String(error),
      );
      throw error;
    }
  }
}
