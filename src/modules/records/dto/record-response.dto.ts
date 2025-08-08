import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ETypeRecord } from '../enums/typeRecord.enum';

export class RecordResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the medical record',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'ID of the psychologist who created the record',
    example: '123e4567-e89b-12d3-a456-426614174001',
    format: 'uuid',
  })
  @Expose()
  psychologist_id: string;

  @ApiProperty({
    description: 'ID of the patient/user this record belongs to',
    example: '123e4567-e89b-12d3-a456-426614174002',
    format: 'uuid',
  })
  @Expose()
  user_id: string;

  @ApiProperty({
    description: 'Content of the medical record or session notes',
    example:
      'Patient showed significant improvement in anxiety management. Discussed coping strategies and assigned homework exercises for the next session.',
  })
  @Expose()
  content: string;

  @ApiProperty({
    description: 'Type/category of the medical record',
    enum: ETypeRecord,
    example: ETypeRecord.PERSONAL_NOTE,
    enumName: 'ETypeRecord',
  })
  @Expose()
  type: ETypeRecord;

  @ApiProperty({
    description: 'Date and time when the record was created',
    example: '2025-01-15T10:30:00.000Z',
    format: 'date-time',
  })
  @Expose()
  @Type(() => Date)
  created_at: Date;

  @ApiProperty({
    description: 'Date and time when the record was last updated',
    example: '2025-01-15T11:15:00.000Z',
    format: 'date-time',
  })
  @Expose()
  @Type(() => Date)
  updated_at: Date;

  @ApiProperty({
    description: 'Indicates if the record is still active/available',
    example: true,
    default: true,
  })
  @Expose()
  is_active: boolean;
}
