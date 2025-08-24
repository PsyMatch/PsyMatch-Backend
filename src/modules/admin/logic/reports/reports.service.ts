import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from 'src/modules/appointments/entities/appointment.entity';
import { Repository } from 'typeorm/repository/Repository';
import { WeeklyReportDataDTO } from '../../DTOs/weekly-report-data.dto';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  async generateAppointmentsReport(): Promise<WeeklyReportDataDTO[]> {
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const appointmentsByWeek = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .select([
        "TO_CHAR(DATE_TRUNC('week', appointment.date), 'IYYY-\"W\"IW') AS week",
        'COUNT(*)::int AS total_appointments',
        "COUNT(CASE WHEN appointment.status = 'completed' THEN 1 END)::int AS completed_appointments",
        "COUNT(CASE WHEN appointment.status = 'cancelled' THEN 1 END)::int AS cancelled_appointments",
        "COUNT(CASE WHEN appointment.status = 'pending' THEN 1 END)::int AS pending_appointments",
      ])
      .where('appointment.date >= :twoWeeksAgo', { twoWeeksAgo })
      .groupBy('week')
      .orderBy('week', 'DESC')
      .getRawMany<WeeklyReportDataDTO>();

    this.logger.log(
      `Reporte de citas de las últimas 2 semanas generado: ${appointmentsByWeek.length} semanas de datos`,
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
        error,
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
}
