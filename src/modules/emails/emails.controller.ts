import { Controller, Post, Body } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { SendEmailDto } from './dto/send-email.dto';

@Controller('emails')
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}

  @Post('welcome')
  async sendWelcomeEmail(@Body() body: SendEmailDto) {
    await this.emailsService.sendWelcomeEmail(body.email, body.name);
    return {
      message: `📨 Email de bienvenida enviado a ${body.email}`,
    };
  }

  @Post('new-password')
  async sendNewPasswordEmail(@Body() body: SendEmailDto) {
    await this.emailsService.sendNewPasswordEmail(body.email, body.name);
    return {
      message: `📨 Email de notificación de nueva contraseña enviado a ${body.email}`,
    };
  }

  @Post('password-changed')
  async sendPasswordChangedEmail(@Body() body: SendEmailDto) {
    await this.emailsService.sendPasswordChangedEmail(body.email, body.name);
    return {
      message: `📨 Email de notificación de cambio de contraseña enviado a ${body.email}`,
    };
  }

  @Post('psychologist-verified')
  async sendPsychologistVerifiedEmail(@Body() body: SendEmailDto) {
    await this.emailsService.sendPsychologistVerifiedEmail(
      body.email,
      body.name,
    );
    return {
      message: `📨 Email de verificación de psicólogo enviado a ${body.email}`,
    };
  }

  @Post('appointment-confirmed')
  async sendAppointmentConfirmedEmail(@Body() body: SendEmailDto) {
    await this.emailsService.sendAppointmentConfirmedEmail(
      body.email,
      body.name,
    );
    return {
      message: `📨 Email de confirmación de cita enviado a ${body.email}`,
    };
  }

  @Post('appointment-reminder')
  async sendAppointmentReminderEmail(@Body() body: SendEmailDto) {
    await this.emailsService.sendAppointmentReminderEmail(
      body.email,
      body.name,
    );
    return {
      message: `📨 Email de recordatorio de cita enviado a ${body.email}`,
    };
  }

  @Post('leave-review')
  async sendLeaveReviewEmail(@Body() body: SendEmailDto) {
    await this.emailsService.sendLeaveReviewEmail(body.email, body.name);
    return {
      message: `📨 Email de solicitud de reseña enviado a ${body.email}`,
    };
  }

  @Post('promoted')
  async sendPromotedEmail(@Body() body: SendEmailDto) {
    await this.emailsService.sendPromotedEmail(body.email, body.name);
    return {
      message: `📨 Email de promoción a Administrador enviado a ${body.email}`,
    };
  }

  @Post('banned')
  async sendBannedEmail(@Body() body: SendEmailDto) {
    await this.emailsService.sendBannedEmail(body.email, body.name);
    return {
      message: `📨 Email de notificación de baneo enviado a ${body.email}`,
    };
  }
}
