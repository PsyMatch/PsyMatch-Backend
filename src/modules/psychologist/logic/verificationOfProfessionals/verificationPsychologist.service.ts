import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EPsychologistStatus } from '../../enums/verified.enum';
import { Psychologist } from '../../entities/psychologist.entity';
import {
  PaginatedResponse,
  PaginationDto,
} from '../../../../common/dto/pagination.dto';
import { PaginationService } from '../../../../common/services/pagination.service';
import { ResponseProfessionalDto } from '../../dto/response-professional.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class VerificationPsychologistService {
  constructor(
    @InjectRepository(Psychologist)
    private readonly psychologistRepository: Repository<Psychologist>,
    private readonly paginationService: PaginationService,
  ) {}

  async getAllVerifiedService(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<ResponseProfessionalDto>> {
    const queryBuilder =
      this.psychologistRepository.createQueryBuilder('psychologist');
    queryBuilder.where('psychologist.verified = :status', {
      status: EPsychologistStatus.VALIDATED,
    });

    const paginatedResult = await this.paginationService.paginate(
      queryBuilder,
      paginationDto,
    );

    const transformedItems = plainToInstance(
      ResponseProfessionalDto,
      paginatedResult.data,
      {
        excludeExtraneousValues: true,
      },
    );

    return {
      ...paginatedResult,
      data: transformedItems,
    };
  }
}
