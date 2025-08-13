import { PartialType } from '@nestjs/swagger';
import { CreateAppointmentDto } from './create-appointment.dto';
import { IsEnum, IsOptional, IsUUID, IsDateString } from 'class-validator';
import { EModality } from '../../psychologist/enums/modality.enum';
import { AppointmentStatus } from '../enums/appointment-status.enum';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
  @IsOptional()
  @IsUUID('4', { message: 'user_id debe ser un UUID válido' })
  user_id?: string;

  @IsOptional()
  @IsUUID('4', { message: 'psychologist_id debe ser un UUID válido' })
  psychologist_id?: string;

  @IsOptional()
  @IsDateString(
    {},
    { message: 'fecha debe ser una cadena de fecha ISO 8601 válida' },
  )
  date?: string;

  @IsOptional()
  @IsEnum(AppointmentStatus, {
    message: 'estado debe ser un estado de cita válido',
  })
  status?: AppointmentStatus;

  @IsOptional()
  @IsEnum(EModality, {
    message: 'modalidad debe ser un tipo de modalidad válida',
  })
  modality?: EModality;
}
