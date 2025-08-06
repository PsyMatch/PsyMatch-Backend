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
    if (!user)
      throw new NotFoundException(`User with ID ${dto.user_id} not found`);

    const psychologist = await this.psychologistRepository.findOne({
      where: { id: dto.psychologist_id },
    });
    if (!psychologist)
      throw new NotFoundException(
        `Psychologist with ID ${dto.psychologist_id} not found`,
      );

    const record = this.recordRepository.create(dto);
    return await this.recordRepository.save(record);
  }

  async findAll(): Promise<Record[]> {
    return await this.recordRepository.find({
      relations: ['user', 'psychologist'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Record> {
    const record = await this.recordRepository.findOne({
      where: { id },
      relations: ['user', 'psychologist'],
    });

    if (!record) {
      throw new NotFoundException(`Record with ID ${id} not found`);
    }

    return record;
  }

  async update(id: string, dto: UpdateRecordDto): Promise<Record> {
    const record = await this.findOne(id);

    Object.assign(record, dto);

    return await this.recordRepository.save(record);
  }

  async remove(id: string): Promise<void> {
    const record = await this.findOne(id);
    await this.recordRepository.remove(record);
  }

  async findByUserId(userId: string): Promise<Record[]> {
    return await this.recordRepository.find({
      where: { user_id: userId },
      relations: ['psychologist'],
      order: { created_at: 'DESC' },
    });
  }

  async findByPsychologistId(psychologistId: string): Promise<Record[]> {
    return await this.recordRepository.find({
      where: { psychologist_id: psychologistId },
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
  }

  async findByUserAndPsychologist(
    userId: string,
    psychologistId: string,
  ): Promise<Record[]> {
    return await this.recordRepository.find({
      where: {
        user_id: userId,
        psychologist_id: psychologistId,
      },
      order: { created_at: 'DESC' },
    });
  }
}
