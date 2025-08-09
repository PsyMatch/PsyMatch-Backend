import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive, Min, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationDto {
  @ApiProperty({
    description: 'Page to display (starts at 1)',
    example: 1,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Transform(({ value }) => {
    const parsed = parseInt(value as string, 10);
    return isNaN(parsed) ? 1 : parsed;
  })
  @IsInt({ message: 'Page must be an integer' })
  @IsPositive({ message: 'Page must be a positive number' })
  page: number = 1;

  @ApiProperty({
    description: 'Number of elements per page',
    example: 10,
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Transform(({ value }) => {
    const parsed = parseInt(value as string, 10);
    return isNaN(parsed) ? 10 : parsed;
  })
  @IsInt({ message: 'Limit must be an integer' })
  @Min(1, { message: 'Minimum limit is 1' })
  limit: number = 10;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
