import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdatePsychologistDto } from './dto/update-psychologist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Psychologist } from './entities/psychologist.entity';
import { EPsychologistStatus } from './enums/verified.enum';
import { PaginatedPendingRequestsDto } from './dto/response-pending-psychologist.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class PsychologistService {
  constructor(
    @InjectRepository(Psychologist)
    private readonly psychologistRepository: Repository<Psychologist>,
    private readonly jwtService: JwtService,
  ) {}

  async getAllVerifiedRequestService(
    page: number,
    limit: number,
  ): Promise<PaginatedPendingRequestsDto> {
    const [pendingRequests, total] =
      await this.psychologistRepository.findAndCount({
        where: { verified: EPsychologistStatus.PENDING },
        skip: (page - 1) * limit,
        take: limit,
      });

    if (!total)
      throw new NotFoundException('No pending psychologist requests found');

    const totalPages = Math.ceil(total / limit);

    if (page > totalPages && total > 0) {
      throw new NotFoundException(
        `The requested page (${page}) exceeds the maximum (${totalPages})`,
      );
    }

    return {
      data: pendingRequests,
      total: total,
      page: page,
      limit: limit,
      totalPages: totalPages,
    };
  }

  async findOne(id: string): Promise<Psychologist> {
    const psychologist = await this.psychologistRepository.findOne({
      where: { id, is_active: true },
      relations: ['patients', 'reviews'],
    });

    if (!psychologist) {
      throw new NotFoundException('Psychologist not found');
    }

    return psychologist;
  }

  async update(
    id: string,
    updatePsychologistDto: UpdatePsychologistDto,
  ): Promise<Psychologist> {
    const psychologist = await this.findOne(id);

    Object.assign(psychologist, updatePsychologistDto);

    return await this.psychologistRepository.save(psychologist);
  }

  async remove(id: string): Promise<{ message: string }> {
    const psychologist = await this.findOne(id);

    psychologist.is_active = false;
    await this.psychologistRepository.save(psychologist);

    return { message: 'Psychologist removed successfully' };
  }
}
