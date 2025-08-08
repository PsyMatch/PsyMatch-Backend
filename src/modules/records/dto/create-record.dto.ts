import { IsNotEmpty, IsString, IsEnum, IsUUID, Length } from 'class-validator';
import { ETypeRecord } from '../enums/typeRecord.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRecordDto {
  @ApiProperty({
    description: 'ID of the psychologist creating the medical record',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsNotEmpty({ message: 'Psychologist ID is required' })
  @IsUUID('4', { message: 'Psychologist ID must be a valid UUID' })
  psychologist_id: string;

  @ApiProperty({
    description: 'ID of the patient/user for whom the record is being created',
    example: '123e4567-e89b-12d3-a456-426614174001',
    format: 'uuid',
  })
  @IsNotEmpty({ message: 'User ID is required' })
  @IsUUID('4', { message: 'User ID must be a valid UUID' })
  user_id: string;

  @ApiProperty({
    description: 'Detailed content of the medical record or session notes',
    example:
      'Patient showed significant improvement in anxiety management. Discussed coping strategies and assigned homework exercises for the next session.',
    minLength: 10,
    maxLength: 5000,
  })
  @IsNotEmpty({ message: 'Record content is required' })
  @IsString({ message: 'Content must be a string' })
  @Length(10, 5000, {
    message: 'Content must be between 10 and 5000 characters',
  })
  content: string;

  @ApiProperty({
    description: 'Type/category of the medical record',
    enum: ETypeRecord,
    example: ETypeRecord.PERSONAL_NOTE,
    enumName: 'ETypeRecord',
  })
  @IsNotEmpty({ message: 'Record type is required' })
  @IsEnum(ETypeRecord, {
    message: `Type must be one of: ${Object.values(ETypeRecord).join(', ')}`,
  })
  type: ETypeRecord;
}
