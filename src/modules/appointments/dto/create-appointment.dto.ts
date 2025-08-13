import {
  IsEnum,
  IsUUID,
  IsDateString,
  IsOptional,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { AppointmentStatus } from '../entities/appointment.entity';
import { EModality } from '../../psychologist/enums/modality.enum';

export class CreateAppointmentDto {
  @ApiProperty({
    description: 'UUID del paciente/usuario que reserva la cita',
    example: 'user-uuid',
    format: 'uuid',
  })
  @IsUUID('4', { message: 'user_id debe ser un UUID válido' })
  user_id: string;

  @ApiProperty({
    description: 'UUID del psicólogo para la cita',
    example: 'psychologist-uuid',
    format: 'uuid',
  })
  @IsUUID('4', { message: 'psychologist_id debe ser un UUID válido' })
  psychologist_id: string;

  @ApiProperty({
    description: 'Fecha y hora de la cita en formato ISO 8601',
    example: '2024-03-15T10:00:00Z',
    format: 'date-time',
  })
  @IsDateString(
    {},
    { message: 'fecha debe ser una cadena de fecha ISO 8601 válida' },
  )
  date: string;

  @ApiPropertyOptional({
    description: 'Duración de la cita en minutos',
    example: 60,
    default: 60,
    minimum: 30,
    maximum: 180,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? value : parsed;
    }
    return typeof value === 'number' ? value : undefined;
  })
  @IsNumber({}, { message: 'duración debe ser un número' })
  @IsPositive({ message: 'duración debe ser un número positivo' })
  duration?: number;

  @ApiPropertyOptional({
    description: 'Estado de la cita',
    enum: AppointmentStatus,
    example: AppointmentStatus.PENDING,
    default: AppointmentStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(AppointmentStatus, {
    message: 'estado debe ser un estado de cita válido',
  })
  status?: AppointmentStatus;

  @ApiProperty({
    description: 'Modalidad de la cita (presencial, virtual o híbrida)',
    enum: EModality,
    example: EModality.IN_PERSON,
  })
  @IsEnum(EModality, {
    message: 'modalidad debe ser un tipo de modalidad válida',
  })
  modality: EModality;
}
