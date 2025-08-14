import {
  IsUUID,
  IsEnum,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsInt,
  Min,
  MaxLength,
  IsString,
  Matches,
  IsNumber,
  MinLength,
} from 'class-validator';
import { AppointmentStatus } from '../enums/appointment-status.enum';
import { EModality } from '../../psychologist/enums/modality.enum';

export class CreateAppointmentDto {
  // Fecha en formato YYYY-MM-DD o ISO. Usaremos solo la fecha para combinar con hour
  @IsDateString()
  @IsNotEmpty()
  date: string;

  // Hora separada (HH:mm)
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'hour debe tener formato HH:mm',
  })
  hour: string;

  @IsOptional()
  @IsInt()
  @Min(15)
  duration?: number; // minutos

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

  // Nuevos campos
  @IsOptional()
  @IsString()
  @MinLength(3)
  session_type?: string;

  @IsOptional()
  @IsString()
  therapy_approach?: string;

  @IsOptional()
  @IsString()
  insurance?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price?: number;
}
