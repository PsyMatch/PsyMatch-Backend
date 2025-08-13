import {
  IsUUID,
  IsEnum,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsInt,
  Min,
  MaxLength,
} from 'class-validator';
import { AppointmentStatus } from '../enums/appointment-status.enum';
import { EModality } from 'src/modules/psychologist/enums/modality.enum';

export class CreateAppointmentDto {
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsOptional()
  @IsInt()
  @Min(15)
  duration?: number;

  @IsOptional()
  @MaxLength(500)
  notes?: string;

  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @IsUUID()
  @IsNotEmpty()
  psychologist_id: string;

  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @IsEnum(EModality)
  modality: EModality;
}
