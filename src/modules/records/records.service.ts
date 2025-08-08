import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { Record } from './entities/record.entity';
import { User } from '../users/entities/user.entity';
import { Psychologist } from '../psychologist/entities/psychologist.entity';

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(Record)
    private readonly recordRepository: Repository<Record>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Psychologist)
    private readonly psychologistRepository: Repository<Psychologist>,
  ) {}

  async create(dto: CreateRecordDto): Promise<Record> {
    const user = await this.userRepository.findOne({
      where: { id: dto.user_id },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${dto.user_id} not found`);
    }

    const psychologist = await this.psychologistRepository.findOne({
      where: { id: dto.psychologist_id },
    });
    if (!psychologist) {
      throw new NotFoundException(
        `Psychologist with ID ${dto.psychologist_id} not found`,
      );
    }

    const record = this.recordRepository.create(dto);
    return await this.recordRepository.save(record);
  }

  async findAll(includeInactive: boolean = false): Promise<Record[]> {
    const whereCondition = includeInactive ? {} : { is_active: true };

    const allRecords = await this.recordRepository.find({
      where: whereCondition,
      relations: ['user', 'psychologist'],
      order: { created_at: 'DESC' },
    });

    if (allRecords.length === 0) {
      throw new NotFoundException('No records found');
    }

    return allRecords;
  }

  async findOne(id: string, includeInactive: boolean = false): Promise<Record> {
    const whereCondition = includeInactive ? { id } : { id, is_active: true };

    const record = await this.recordRepository.findOne({
      where: whereCondition,
      relations: ['user', 'psychologist'],
    });

    if (!record) {
      throw new NotFoundException(`Record with ID ${id} not found`);
    }

    return record;
  }

  async update(id: string, dto: UpdateRecordDto): Promise<Record> {
    const record = await this.findOne(id, true);

    Object.assign(record, dto);

    return await this.recordRepository.save(record);
  }

  async remove(id: string): Promise<void> {
    const record = await this.findOne(id, true);
    await this.recordRepository.remove(record);
  }

  async softDelete(id: string): Promise<Record> {
    const record = await this.findOne(id, true);
    record.is_active = false;
    return await this.recordRepository.save(record);
  }

  async findByUserId(
    userId: string,
    includeInactive: boolean = false,
  ): Promise<Record[]> {
    const whereCondition = includeInactive
      ? { user_id: userId }
      : { user_id: userId, is_active: true };

    return await this.recordRepository.find({
      where: whereCondition,
      relations: ['psychologist'],
      order: { created_at: 'DESC' },
    });
  }

  async findByPsychologistId(
    psychologistId: string,
    includeInactive: boolean = false,
  ): Promise<Record[]> {
    const whereCondition = includeInactive
      ? { psychologist_id: psychologistId }
      : { psychologist_id: psychologistId, is_active: true };

    return await this.recordRepository.find({
      where: whereCondition,
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
  }

  async findByUserAndPsychologist(
    userId: string,
    psychologistId: string,
    includeInactive: boolean = false,
  ): Promise<Record[]> {
    const whereCondition = includeInactive
      ? { user_id: userId, psychologist_id: psychologistId }
      : { user_id: userId, psychologist_id: psychologistId, is_active: true };

    return await this.recordRepository.find({
      where: whereCondition,
      order: { created_at: 'DESC' },
    });
  }

  helloWorld(): string {
    return 'Hello World from RecordsService!';
  }
}
