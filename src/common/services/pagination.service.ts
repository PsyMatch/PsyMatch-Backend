import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder, ObjectLiteral } from 'typeorm';
import {
  PaginationDto,
  PaginationMeta,
  PaginatedResponse,
} from '../dto/pagination.dto';

@Injectable()
export class PaginationService {
  async paginate<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<T>> {
    const { page = 1, limit = 10 } = paginationDto;
    const offset = (page - 1) * limit;

    queryBuilder.limit(limit).offset(offset);

    const [data, total] = await queryBuilder.getManyAndCount();

    const meta: PaginationMeta = {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrevious: page > 1,
    };

    return {
      data,
      meta,
    };
  }

  createMeta(total: number, page: number, limit: number): PaginationMeta {
    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrevious: page > 1,
    };
  }
}
