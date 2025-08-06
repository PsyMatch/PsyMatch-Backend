import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdatePsychologistDto } from './dto/update-psychologist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { Psychologist } from './entities/psychologist.entity';
import { ValidatePsychologistAccountParams } from './interface/validatePsychologistAccountParams.interface';
import { PsychologistStatus } from './enums/verified.enum';

@Injectable()
export class PsychologistService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Psychologist)
    private readonly psychologistRepository: Repository<Psychologist>,
  ) {}

  async validateNewPsychologistAccountService({
    createPsychologistDto: validatePsychologistDto,
    req: {
      user: { id: userId },
    },
  }: ValidatePsychologistAccountParams): Promise<{ message: string }> {
    const userExists = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!userExists) throw new NotFoundException('User not found');

    const newPsychologist = this.psychologistRepository.create({
      ...validatePsychologistDto,
      verified: PsychologistStatus.PENDING,
    });
    await this.psychologistRepository.save(newPsychologist);

    return {
      message: 'Psychologist account validation request submitted successfully',
    };
  }

  findAll() {
    return 'This action returns all psychologist';
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
