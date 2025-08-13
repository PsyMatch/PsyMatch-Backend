import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EPsychologistStatus } from '../../enums/verified.enum';
import { Psychologist } from '../../entities/psychologist.entity';
import {
  PaginatedResponse,
  PaginationDto,
} from 'src/common/dto/pagination.dto';
import { PaginationService } from 'src/common/services/pagination.service';
import { User } from 'src/modules/users/entities/user.entity';

@Injectable()
export class VerificationPsychologistService {
  constructor(
    @InjectRepository(Psychologist)
    private readonly psychologistRepository: Repository<Psychologist>,
    private readonly paginationService: PaginationService,
  ) {}

  async getAllVerifiedRequestService(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<User>> {
    const queryBuilder =
      this.psychologistRepository.createQueryBuilder('psychologist');
    queryBuilder.where('psychologist.verified = :status', {
      status: EPsychologistStatus.PENDING,
    });

    return await this.paginationService.paginate(queryBuilder, paginationDto);
  }

  async findOne(id: string): Promise<Psychologist> {
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

    return psychologist;
  }

  async rejectPsychologistById(id: string) {
    const psychologist = await this.psychologistRepository.findOne({
      where: { id, is_active: true },
    });

    if (!psychologist) {
      throw new NotFoundException('No se encontró el psicólogo');
    }

    psychologist.verified = EPsychologistStatus.REJECTED;
    return await this.psychologistRepository.save(psychologist);
  }
}
