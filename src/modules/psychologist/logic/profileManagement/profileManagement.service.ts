import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Psychologist } from '../../entities/psychologist.entity';
import { UpdatePsychologistDto } from '../../dto/update-psychologist.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Psychologist)
    private readonly psychologistRepository: Repository<Psychologist>,
  ) {}

  async getPsychologistProfile(userId: string): Promise<Psychologist> {
    const psychologist = await this.psychologistRepository.findOne({
      where: { id: userId },
    });

    if (!psychologist) {
      throw new NotFoundException('Perfil del psicólogo no encontrado');
    }

    return psychologist;
  }

  async updatePsychologistProfile(
    userId: string,
    newProfileData: UpdatePsychologistDto,
  ) {
    const psychologist = await this.psychologistRepository.findOne({
      where: { id: userId },
    });

    if (!psychologist) {
      throw new NotFoundException('Perfil del psicólogo no encontrado');
    }

    Object.assign(psychologist, newProfileData);

    await this.psychologistRepository.save(psychologist);

    return psychologist;
  }
}
