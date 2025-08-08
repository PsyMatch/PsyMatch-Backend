import {
  IsOptional,
  IsString,
  IsEnum,
  IsUUID,
  Length,
  IsBoolean,
} from 'class-validator';
import { ETypeRecord } from '../enums/typeRecord.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRecordDto {
  @ApiPropertyOptional({
    description: 'ID of the psychologist (only for administrative updates)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID('4', { message: 'Psychologist ID must be a valid UUID' })
  psychologist_id?: string;

  @ApiPropertyOptional({
    description: 'ID of the patient/user (only for administrative updates)',
    example: '123e4567-e89b-12d3-a456-426614174001',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID('4', { message: 'User ID must be a valid UUID' })
  user_id?: string;

  @ApiPropertyOptional({
    description: 'Updated content of the medical record or session notes',
    example:
      'Updated: Patient showed excellent progress in managing anxiety. Completed all assigned homework and demonstrated new coping techniques.',
    minLength: 10,
    maxLength: 5000,
  })
  @IsOptional()
  @IsString({ message: 'Content must be a string' })
  @Length(10, 5000, {
    message: 'Content must be between 10 and 5000 characters',
  })
  content?: string;

  @ApiPropertyOptional({
    description: 'Updated type/category of the medical record',
    enum: ETypeRecord,
    example: ETypeRecord.PERSONAL_NOTE,
    enumName: 'ETypeRecord',
  })
  @IsOptional()
  @IsEnum(ETypeRecord, {
    message: `Type must be one of: ${Object.values(ETypeRecord).join(', ')}`,
  })
  type?: ETypeRecord;

  @ApiPropertyOptional({
    description: 'Set record as active or inactive',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'is_active must be a boolean value' })
  is_active?: boolean;
}
