import { IsNotEmpty, IsString, IsEnum, IsUUID } from 'class-validator';
import { ETypeRecord } from '../enums/typeRecord.enum';

export class CreateRecordDto {
  @IsNotEmpty()
  @IsUUID()
  psychologist_id: string;

  @IsNotEmpty()
  @IsUUID()
  user_id: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsEnum(ETypeRecord)
  type: ETypeRecord;
}
