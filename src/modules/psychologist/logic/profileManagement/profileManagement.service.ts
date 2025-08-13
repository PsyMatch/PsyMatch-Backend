import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Psychologist } from '../../entities/psychologist.entity';
import { UpdatePsychologistDto } from '../../dto/update-psychologist.dto';
import { ERole } from 'src/common/enums/role.enum';

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
    console.log('Updating profile for userId:', userId);
    const psychologist = await this.psychologistRepository.findOne({
      where: {
        id: userId,
        role: ERole.PSYCHOLOGIST,
      },
    });

    if (!psychologist) {
      throw new NotFoundException(
        'Perfil del psicólogo no encontrado. Asegúrate de que estás autenticado como psicólogo.',
      );
    }

    Object.assign(psychologist, newProfileData);

    await this.psychologistRepository.save(psychologist);

    return psychologist;
  }
}
