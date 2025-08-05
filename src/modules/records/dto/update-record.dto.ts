import { IsOptional, IsString, IsEnum, IsUUID } from 'class-validator';
import { ETypeRecord } from '../enums/typeRecord.enum';

export class UpdateRecordDto {
  @IsOptional()
  @IsUUID()
  psychologist_id?: string;

  @IsOptional()
  @IsUUID()
  user_id?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsEnum(ETypeRecord)
  type?: ETypeRecord;
}
