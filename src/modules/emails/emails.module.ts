import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { EmailsService } from './emails.service';
import { EmailsController } from './emails.controller';
import { envs } from '../../configs/envs.config';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: envs.nodemailer.host,
        port: envs.nodemailer.port,
        secure: false,
        auth: {
          user: envs.nodemailer.user,
          pass: envs.nodemailer.pass,
        },
      },
      defaults: {
        from: envs.nodemailer.from,
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [EmailsController],
  providers: [EmailsService],
  exports: [EmailsService],
})
export class EmailsModule {}
