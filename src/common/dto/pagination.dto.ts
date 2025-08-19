import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive, Min, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationDto {
  @ApiProperty({
    description: 'Página a mostrar (comienza en 1)',
    example: 1,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Transform(({ value }) => {
    const parsed = parseInt(value as string, 10);
    return isNaN(parsed) ? 1 : parsed;
  })
  @IsInt({ message: 'La página debe ser un número entero' })
  @IsPositive({ message: 'La página debe ser un número positivo' })
  page: number = 1;

  @ApiProperty({
    description: 'Cantidad de elementos por página',
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
  @IsInt({ message: 'El límite debe ser un número entero' })
  @Min(1, { message: 'El límite mínimo es 1' })
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
