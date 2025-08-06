import { IsNotEmpty, IsString, IsEnum, IsUUID } from 'class-validator';
import { ETypeRecord } from '../enums/typeRecord.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRecordDto {
  @ApiProperty({
    description: 'ID of the psychologist associated with the record',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  psychologist_id: string;

  @ApiProperty({
    description: 'ID of the user associated with the record',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsNotEmpty()
  @IsUUID()
  user_id: string;

  @ApiProperty({
    description: 'Content of the record',
    example: 'This is a sample record content.',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Type of the record',
    enum: ETypeRecord,
    example: ETypeRecord.PERSONAL_NOTE,
  })
  @IsNotEmpty()
  @IsEnum(ETypeRecord)
  type: ETypeRecord;
}
