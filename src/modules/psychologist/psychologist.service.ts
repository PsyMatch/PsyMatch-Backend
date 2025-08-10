import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdatePsychologistDto } from './dto/update-psychologist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Psychologist } from './entities/psychologist.entity';
import { EPsychologistStatus } from './enums/verified.enum';
import { PaginatedPendingRequestsDto } from './dto/response-pending-psychologist.dto';
import { CreatePsychologistDto } from './dto/validate-psychologist.dto';
import bcrypt from 'bcryptjs';
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

  findOne(id: number) {
    return `This action returns a #${id} psychologist`;
  }

  update(id: number, _updatePsychologistDto: UpdatePsychologistDto) {
    return `This action updates a #${id} psychologist`;
  }

  remove(id: number) {
    return `This action removes a #${id} psychologist`;
  }
}
