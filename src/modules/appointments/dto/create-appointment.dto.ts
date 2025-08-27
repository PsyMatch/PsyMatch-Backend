import {
  IsUUID,
  IsEnum,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  Min,
  MaxLength,
  IsString,
  Matches,
  IsNumber,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EModality } from '../../psychologist/enums/modality.enum';
import { ESessionType } from '../../psychologist/enums/session-types.enum';
import { ETherapyApproach } from '../../psychologist/enums/therapy-approaches.enum';
import { EPsychologistSpecialty } from '../../psychologist/enums/specialities.enum';

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
    description: 'Hora de la cita - Debe coincidir con los horarios disponibles del psicólogo',
    example: '14:00',
    pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
  })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'hour debe estar en formato HH:MM (ej: 14:00)',
  })
  hour: string;

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

  @ApiProperty({
    description: 'Modalidad de la sesión (presencial, online o híbrida)',
    enum: EModality,
    example: EModality.ONLINE,
  })
  @IsEnum(EModality)
  modality: EModality;

  @ApiPropertyOptional({
    description: 'Especialidad del psicólogo',
    enum: EPsychologistSpecialty,
    example: EPsychologistSpecialty.ANGER_MANAGEMENT,
  })
  @IsOptional()
  specialty?: EPsychologistSpecialty;

  @ApiPropertyOptional({
    description: 'Tipo de sesión terapéutica',
    enum: ESessionType,
    example: ESessionType.INDIVIDUAL,
  })
  @IsOptional()
  session_type?: ESessionType;

  @ApiPropertyOptional({
    description: 'Enfoque terapéutico a utilizar',
    enum: ETherapyApproach,
    example: ETherapyApproach.COGNITIVE_BEHAVIORAL_THERAPY,
  })
  @IsOptional()
  @IsString()
  therapy_approach?: ETherapyApproach;

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
  @Transform(({ value }): number | undefined => {
    if (value === null || value === undefined || value === '') return undefined;
    const num = Number(value);
    return isNaN(num) ? undefined : num;
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price?: number;
}
