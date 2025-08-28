import { Controller, Post, Body } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { SendEmailDto } from './dto/send-email.dto';
import { SendBannedEmailDto } from './dto/send-banned-email.dto';
import { ApiTags } from '@nestjs/swagger';
import { SendAppointmentConfirmedEmailSwaggerDoc } from './documentation/appointment-confirmed.doc';
import { SendBannedEmailSwaggerDoc } from './documentation/banned.doc';
import { SendLeaveReviewEmailSwaggerDoc } from './documentation/leave-review.doc';
import { SendNewPasswordEmailSwaggerDoc } from './documentation/new-password.doc';
import { SendPasswordChangedEmailSwaggerDoc } from './documentation/password-changed.doc';
import { SendPromotedEmailSwaggerDoc } from './documentation/promoted.doc';
import { SendPsychologistVerifiedEmailSwaggerDoc } from './documentation/psychologist-verified.doc';
import { SendWelcomeEmailSwaggerDoc } from './documentation/welcome.doc';
import { SendEmailChangePasswordDto } from './dto/send-email-change-password.dto';
import { SendPendingPaymentEmailSwaggerDoc } from './documentation/pending-payment.doc';
import { SendUnbannedEmailSwaggerDoc } from './documentation/unbanned.doc';

@ApiTags('Emails')
@Controller('emails')
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}

  @Post('welcome')
  @SendWelcomeEmailSwaggerDoc()
  async sendWelcomeEmail(@Body() body: SendEmailDto) {
    await this.emailsService.sendWelcomeEmail(body.email);
    return {
      message: `📨 Email de bienvenida enviado a ${body.email}`,
    };
  }

  @Post('new-password')
  @SendNewPasswordEmailSwaggerDoc()
  async sendNewPasswordEmail(@Body() body: SendEmailChangePasswordDto) {
    await this.emailsService.sendNewPasswordEmail(body.email, body.token);
    return {
      message: `📨 Email de notificación de nueva contraseña enviado a ${body.email}`,
    };
  }

  @Post('password-changed')
  @SendPasswordChangedEmailSwaggerDoc()
  async sendPasswordChangedEmail(@Body() body: SendEmailDto) {
    await this.emailsService.sendPasswordChangedEmail(body.email);
    return {
      message: `📨 Email de notificación de cambio de contraseña enviado a ${body.email}`,
    };
  }

  @Post('psychologist-verified')
  @SendPsychologistVerifiedEmailSwaggerDoc()
  async sendPsychologistVerifiedEmail(@Body() body: SendEmailDto) {
    await this.emailsService.sendPsychologistVerifiedEmail(body.email);
    return {
      message: `📨 Email de verificación de psicólogo enviado a ${body.email}`,
    };
  }

  @Post('appointment-confirmed')
  @SendAppointmentConfirmedEmailSwaggerDoc()
  sendAppointmentConfirmedEmail(@Body() body: SendEmailDto) {
    return {
      message: `📨 Email de confirmación de cita enviado a ${body.email}`,
    };
  }

  // @Post('appointment-reminder')
  // @SendAppointmentReminderEmailSwaggerDoc()
  // async sendAppointmentReminderEmail(@Body() body: SendEmailDto) {
  //   await this.emailsService.sendAppointmentReminderEmail(body.email);
  //   return {
  //     message: `📨 Email de recordatorio de cita enviado a ${body.email}`,
  //   };
  // }

  @Post('pending-payment')
  @SendPendingPaymentEmailSwaggerDoc()
  async sendPendingPaymentEmail(@Body() body: SendEmailDto) {
    await this.emailsService.sendPendingPaymentEmail(body.email);
    return {
      message: `📨 Email de notificación de pago pendiente enviado a ${body.email}`,
    };
  }

  @Post('leave-review')
  @SendLeaveReviewEmailSwaggerDoc()
  async sendLeaveReviewEmail(@Body() body: SendEmailDto) {
    await this.emailsService.sendLeaveReviewEmail(body.email);
    return {
      message: `📨 Email de solicitud de reseña enviado a ${body.email}`,
    };
  }

  @Post('promoted')
  @SendPromotedEmailSwaggerDoc()
  async sendPromotedEmail(@Body() body: SendEmailDto) {
    await this.emailsService.sendPromotedEmail(body.email);
    return {
      message: `📨 Email de promoción a Administrador enviado a ${body.email}`,
    };
  }

  @Post('banned')
  @SendBannedEmailSwaggerDoc()
  async sendBannedEmail(@Body() body: SendBannedEmailDto) {
    await this.emailsService.sendBannedEmail(body.email, body.reason);
    return {
      message: `📨 Email de notificación de baneo enviado a ${body.email}`,
    };
  }

  @Post('unbanned')
  @SendUnbannedEmailSwaggerDoc()
  async sendUnbannedEmail(@Body() body: SendEmailDto) {
    await this.emailsService.sendUnbannedEmail(body.email);
    return {
      message: `📨 Email de notificación de desbaneo enviado a ${body.email}`,
    };
  }
}
