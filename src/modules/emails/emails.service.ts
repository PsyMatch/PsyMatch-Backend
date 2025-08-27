import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { QueryHelper } from '../utils/helpers/query.helper';
import { User } from '../users/entities/user.entity';
import { ERole } from '../../common/enums/role.enum';
import { envs } from 'src/configs/envs.config';

@Injectable()
export class EmailsService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly queryHelper: QueryHelper,
  ) {}

  async sendWelcomeEmail(to: string) {
    return this.queryHelper.runInTransaction(async (queryRunner) => {
      const userRepo = queryRunner.manager.getRepository(User);
      const user = await userRepo.findOne({
        where: { email: to, is_active: true },
      });
      if (!user) {
        throw new NotFoundException(
          `No se encontró el usuario con email ${to}`,
        );
      }
      if (user.role === ERole.PATIENT) {
        await this.mailerService.sendMail({
          to,
          subject: '¡Bienvenido a nuestra plataforma!',
          template: 'welcome-patient',
          context: {
            date: new Date().toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
          },
        });
      } else if (user.role === ERole.PSYCHOLOGIST) {
        await this.mailerService.sendMail({
          to,
          subject: '¡Bienvenido a nuestra plataforma!',
          template: 'welcome-psychologist',
          context: {
            date: new Date().toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
          },
        });
      } else {
        throw new BadRequestException(
          `El usuario con email ${to} no es un psicólogo`,
        );
      }
    });
  }

  async sendNewPasswordEmail(to: string, resetToken: string) {
    return this.queryHelper.runInTransaction(async (queryRunner) => {
      const userRepo = queryRunner.manager.getRepository(User);
      const user = await userRepo.findOne({
        where: { email: to, is_active: true },
      });
      if (!user) {
        throw new NotFoundException(
          `No se encontró el usuario con email ${to}`,
        );
      }

      // NECESARIO PARA LA RECUPERACIÓN DE CONTRASEÑA////////////////////
      const resetLink =
        envs.server.environment === 'production'
          ? `https://psymatch.com/reset-password?token=${resetToken}`
          : `http://localhost:3000/reset-password?token=${resetToken}`;
      ///////////////////////////////////////////////////////////////////

      await this.mailerService.sendMail({
        to,
        subject: 'Genera una nueva contraseña',
        template: 'new-password',
        context: {
          resetLink,
          date: new Date().toLocaleString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      });
    });
  }

  async sendPasswordChangedEmail(to: string) {
    return this.queryHelper.runInTransaction(async (queryRunner) => {
      const userRepo = queryRunner.manager.getRepository(User);
      const user = await userRepo.findOne({
        where: { email: to, is_active: true },
      });
      if (!user) {
        throw new NotFoundException(
          `No se encontró el usuario con email ${to}`,
        );
      }
      await this.mailerService.sendMail({
        to,
        subject: 'Contraseña modificada exitosamente',
        template: 'password-changed',
        context: {
          date: new Date().toLocaleString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      });
    });
  }

  async sendPsychologistVerifiedEmail(to: string) {
    return this.queryHelper.runInTransaction(async (queryRunner) => {
      const userRepo = queryRunner.manager.getRepository(User);
      const user = await userRepo.findOne({
        where: { email: to, is_active: true },
      });
      if (!user) {
        throw new NotFoundException(
          `No se encontró el usuario con email ${to}`,
        );
      }
      if (user.role !== ERole.PSYCHOLOGIST) {
        throw new BadRequestException(
          `El usuario con email ${to} no es un psicólogo`,
        );
      }
      await this.mailerService.sendMail({
        to,
        subject: '¡Ahora formas parte de nuestra red de profesionales!',
        template: 'psychologist-verified',
        context: {
          date: new Date().toLocaleString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      });
    });
  }

  async sendAppointmentConfirmedEmail(to: string) {
    return this.queryHelper.runInTransaction(async (queryRunner) => {
      const userRepo = queryRunner.manager.getRepository(User);
      const user = await userRepo.findOne({
        where: { email: to, is_active: true },
      });
      if (!user) {
        throw new NotFoundException(
          `No se encontró el usuario con email ${to}`,
        );
      }
      await this.mailerService.sendMail({
        to,
        subject: 'Cita confirmada',
        template: 'appointment-confirmed',
        context: {
          date: new Date().toLocaleString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      });
    });
  }

  async sendAppointmentReminderEmail(to: string) {
    return this.queryHelper.runInTransaction(async (queryRunner) => {
      const userRepo = queryRunner.manager.getRepository(User);
      const user = await userRepo.findOne({
        where: { email: to, is_active: true },
      });
      if (!user) {
        throw new NotFoundException(
          `No se encontró el usuario con email ${to}`,
        );
      }
      await this.mailerService.sendMail({
        to,
        subject: 'Recordatorio de cita',
        template: 'appointment-reminder',
        context: {
          date: new Date().toLocaleString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      });
    });
  }

  async sendLeaveReviewEmail(to: string) {
    return this.queryHelper.runInTransaction(async (queryRunner) => {
      const userRepo = queryRunner.manager.getRepository(User);
      const user = await userRepo.findOne({
        where: { email: to, is_active: true },
      });
      if (!user) {
        throw new NotFoundException(
          `No se encontró el usuario con email ${to}`,
        );
      }
      await this.mailerService.sendMail({
        to,
        subject: 'Solicitud de reseña',
        template: 'leave-review',
        context: {
          date: new Date().toLocaleString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      });
    });
  }

  async sendPromotedEmail(to: string) {
    return this.queryHelper.runInTransaction(async (queryRunner) => {
      const userRepo = queryRunner.manager.getRepository(User);
      const user = await userRepo.findOne({
        where: { email: to, is_active: true },
      });
      if (!user) {
        throw new NotFoundException(
          `No se encontró el usuario con email ${to}`,
        );
      }
      await this.mailerService.sendMail({
        to,
        subject: '¡Felicidades por tu promoción a Administrador!',
        template: 'promoted',
        context: {
          date: new Date().toLocaleString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      });
    });
  }

  async sendBannedEmail(to: string, reason: string) {
    return this.queryHelper.runInTransaction(async (queryRunner) => {
      const userRepo = queryRunner.manager.getRepository(User);
      const user = await userRepo.findOne({
        where: { email: to, is_active: false },
      });
      if (!user) {
        throw new NotFoundException(
          `El usuario con email ${to} no está baneado`,
        );
      }

      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      const formattedTime = currentDate.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      await this.mailerService.sendMail({
        to,
        subject: 'Has sido baneado de la plataforma',
        template: 'banned',
        context: {
          date: formattedDate,
          time: formattedTime,
          reason: reason,
        },
      });
    });
  }
}
