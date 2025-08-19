import { Injectable, NotFoundException } from '@nestjs/common';
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

  async getAllVerifiedRequestService(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<ResponseProfessionalDto>> {
    const queryBuilder =
      this.psychologistRepository.createQueryBuilder('psychologist');
    queryBuilder.where('psychologist.verified = :status', {
      status: EPsychologistStatus.PENDING,
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

  async findOne(
    id: string,
  ): Promise<{ message: string; data: ResponseProfessionalDto }> {
    const psychologist = await this.psychologistRepository.findOne({
      where: { id, is_active: true },
    });

    if (!psychologist) {
      throw new NotFoundException('No se encontró el psicólogo');
    }

    if (psychologist.verified !== EPsychologistStatus.PENDING) {
      throw new NotFoundException(
        'El psicólogo ya está verificado o no está pendiente de verificación',
      );
    }

    psychologist.verified = EPsychologistStatus.VALIDATED;
    const savedPsychologist =
      await this.psychologistRepository.save(psychologist);

    const transformedPsychologist = plainToInstance(
      ResponseProfessionalDto,
      savedPsychologist,
      {
        excludeExtraneousValues: true,
      },
    );

    return {
      message: 'Psicólogo verificado exitosamente',
      data: transformedPsychologist,
    };
  }

  async rejectPsychologistById(
    id: string,
  ): Promise<{ message: string; data: ResponseProfessionalDto }> {
    const psychologist = await this.psychologistRepository.findOne({
      where: { id, is_active: true },
    });

    if (!psychologist) {
      throw new NotFoundException('No se encontró el psicólogo');
    }

    psychologist.verified = EPsychologistStatus.REJECTED;
    const savedPsychologist =
      await this.psychologistRepository.save(psychologist);

    const transformedPsychologist = plainToInstance(
      ResponseProfessionalDto,
      savedPsychologist,
      {
        excludeExtraneousValues: true,
      },
    );

    return {
      message: 'Psicólogo rechazado exitosamente',
      data: transformedPsychologist,
    };
  }
}
