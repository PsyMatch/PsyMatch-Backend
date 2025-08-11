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
import { EModality } from 'src/modules/psychologist/enums/modality.enum';

export class CreateAppointmentDto {
  @ApiProperty({
    description: 'UUID of the patient/user booking the appointment',
    example: 'user-uuid',
    format: 'uuid',
  })
  @IsUUID('4', { message: 'user_id must be a valid UUID' })
  user_id: string;

  @ApiProperty({
    description: 'UUID of the psychologist for the appointment',
    example: 'psychologist-uuid',
    format: 'uuid',
  })
  @IsUUID('4', { message: 'psychologist_id must be a valid UUID' })
  psychologist_id: string;

  @ApiProperty({
    description: 'Appointment date and time in ISO 8601 format',
    example: '2024-03-15T10:00:00Z',
    format: 'date-time',
  })
  @IsDateString({}, { message: 'date must be a valid ISO 8601 date string' })
  date: string;

  @ApiPropertyOptional({
    description: 'Duration of the appointment in minutes',
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
  @IsNumber({}, { message: 'duration must be a number' })
  @IsPositive({ message: 'duration must be a positive number' })
  duration?: number;

  @ApiPropertyOptional({
    description: 'Status of the appointment',
    enum: AppointmentStatus,
    example: AppointmentStatus.PENDING,
    default: AppointmentStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(AppointmentStatus, {
    message: 'status must be a valid appointment status',
  })
  status?: AppointmentStatus;

  @ApiProperty({
    description: 'Modality of the appointment (in-person, virtual o hybrid)',
    enum: EModality,
    example: EModality.IN_PERSON,
  })
  @IsEnum(EModality, { message: 'modality must be a valid modality type' })
  modality: EModality;
}
