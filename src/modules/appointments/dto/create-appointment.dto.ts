import { IsEnum, IsUUID, IsDateString } from 'class-validator';
import { AppointmentStatus, Modality } from '../entities/appointment.entity';

export class CreateAppointmentDto {
  @IsUUID()
  user_id: string;

  @IsUUID()
  psychologist_id: string;

  @IsDateString()
  date: string;

  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @IsEnum(Modality)
  modality: Modality;
}
