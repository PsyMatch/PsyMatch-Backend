import { Record } from '../entities/record.entity';

export class RecordResponseDto {
  message: string;
  record: Record;
}
