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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AppointmentStatus } from '../enums/appointment-status.enum';
import { EModality } from '../../psychologist/enums/modality.enum';

export class CreateAppointmentDto {
  @ApiProperty({
    description: 'Fecha de la cita en formato YYYY-MM-DD o ISO',
    example: '2025-08-15',
    type: String,
  })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({
    description: 'Hora de la cita en formato HH:mm (24 horas)',
    example: '14:00',
    pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'hour debe tener formato HH:mm',
  })
  hour: string;

  @ApiPropertyOptional({
    description: 'Duración de la sesión en minutos',
    example: 60,
    minimum: 15,
    default: 60,
  })
  @IsOptional()
  @IsInt()
  @Min(15)
  duration?: number;

  @ApiPropertyOptional({
    description: 'Notas adicionales sobre la cita',
    example: 'Primera consulta - ansiedad generalizada',
    maxLength: 500,
  })
  @IsOptional()
  @MaxLength(500)
  notes?: string;

  @ApiProperty({
    description: 'UUID del paciente que solicita la cita',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({
    description: 'UUID del psicólogo con quien se agenda la cita',
    example: '987fcdeb-51a2-43d7-9f12-123456789abc',
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  psychologist_id: string;

  @ApiPropertyOptional({
    description: 'Estado inicial de la cita',
    enum: AppointmentStatus,
    example: AppointmentStatus.PENDING,
    default: AppointmentStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @ApiProperty({
    description: 'Modalidad de la sesión (presencial, online o híbrida)',
    enum: EModality,
    example: EModality.ONLINE,
  })
  @IsEnum(EModality)
  modality: EModality;

  @ApiPropertyOptional({
    description: 'Tipo de sesión terapéutica',
    example: 'Individual',
    minLength: 3,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  session_type?: string;

  @ApiPropertyOptional({
    description: 'Enfoque terapéutico a utilizar',
    example: 'Terapia cognitivo-conductual',
  })
  @IsOptional()
  @IsString()
  therapy_approach?: string;

  @ApiPropertyOptional({
    description: 'Obra social o seguro médico del paciente',
    example: 'OSDE',
  })
  @IsOptional()
  @IsString()
  insurance?: string;

  @ApiPropertyOptional({
    description: 'Precio de la sesión en pesos argentinos',
    example: 8500.0,
    minimum: 0,
    type: 'number',
    format: 'float',
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price?: number;
}
