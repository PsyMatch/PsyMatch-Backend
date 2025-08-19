import { PartialType } from '@nestjs/swagger';
import { CreateAppointmentDto } from './create-appointment.dto';
import {
  IsEnum,
  IsOptional,
  IsUUID,
  IsDateString,
  Matches,
  IsNumber,
  Min,
} from 'class-validator';
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
  @IsDateString({}, { message: 'date debe ser ISO 8601' })
  date?: string;

  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'hour debe ser HH:mm' })
  hour?: string;

  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @IsOptional()
  @IsEnum(EModality)
  modality?: EModality;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price?: number;
}
