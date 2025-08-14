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

    return await this.paginationService.paginate(queryBuilder, paginationDto);
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
    await this.psychologistRepository.save(psychologist);

    return { message: 'Psicólogo verificado exitosamente', data: psychologist };
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
    await this.psychologistRepository.save(psychologist);

    return { message: 'Psicólogo rechazado exitosamente', data: psychologist };
  }
}
