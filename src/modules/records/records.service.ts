import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { Record } from './entities/record.entity';

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(Record)
    private readonly recordRepository: Repository<Record>,
  ) {}

  async create(createRecordDto: CreateRecordDto): Promise<Record> {
    const record = this.recordRepository.create(createRecordDto);
    return await this.recordRepository.save(record);
  }

  async findAll(): Promise<Record[]> {
    return await this.recordRepository.find();
  }

  async findOne(id: string): Promise<Record> {
    const record = await this.recordRepository.findOne({
      where: { id },
    });

    if (!record) {
      throw new NotFoundException(`Record with ID ${id} not found`);
    }

    return record;
  }

  async update(id: string, updateRecordDto: UpdateRecordDto): Promise<Record> {
    const record = await this.findOne(id);

    Object.assign(record, updateRecordDto);

    return await this.recordRepository.save(record);
  }

  async remove(id: string): Promise<void> {
    const record = await this.findOne(id);
    await this.recordRepository.remove(record);
  }

  async findByUserId(userId: string): Promise<Record[]> {
    return await this.recordRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
  }

  async findByPsychologistId(psychologistId: string): Promise<Record[]> {
    return await this.recordRepository.find({
      where: { psychologist_id: psychologistId },
      order: { created_at: 'DESC' },
    });
  }

  helloWorld(): string {
    return 'Hello World from RecordsService!';
  }
}
