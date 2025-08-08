import { ApiProperty } from '@nestjs/swagger';
import { Psychologist } from '../entities/psychologist.entity';

export class PaginatedPendingRequestsDto {
  @ApiProperty({ type: [Psychologist] })
  data: Psychologist[];

  @ApiProperty({ example: 25 })
  total: number;

  @ApiProperty({ example: 2 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 3 })
  totalPages: number;
}
