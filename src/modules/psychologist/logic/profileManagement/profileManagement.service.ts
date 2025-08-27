import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Psychologist } from '../../entities/psychologist.entity';
import { FilesService } from '../../../files/files.service';
import { UpdatePsychologistDto } from '../../dto/update-psychologist.dto';
import { ERole } from '../../../../common/enums/role.enum';
import { ResponseProfessionalDto } from '../../dto/response-professional.dto';
import { plainToInstance } from 'class-transformer';
import { QueryHelper } from '../../../utils/helpers/query.helper';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Psychologist)
    private readonly psychologistRepository: Repository<Psychologist>,
    private readonly queryHelper: QueryHelper,
    private readonly filesService: FilesService,
  ) {}

  async getPsychologistProfile(
    userId: string,
  ): Promise<{ message: string; data: ResponseProfessionalDto }> {
    const psychologist = await this.psychologistRepository.findOne({
      where: { id: userId },
    });

    if (!psychologist) {
      throw new NotFoundException('Perfil del psicólogo no encontrado');
    }

    const transformedData = plainToInstance(
      ResponseProfessionalDto,
      psychologist,
      {
        excludeExtraneousValues: true,
      },
    );

    return {
      message: 'Perfil del psicólogo encontrado',
      data: transformedData,
    };
  }

  async updatePsychologistProfile(
    userId: string,
    userRole: ERole,
    newProfileData: UpdatePsychologistDto,
    profilePicture?: Express.Multer.File,
  ): Promise<{ message: string; data: ResponseProfessionalDto }> {
    const queryResult = await this.queryHelper.runInTransaction(
      async (queryRunner) => {
        const professionalRepo =
          queryRunner.manager.getRepository(Psychologist);

        const professional = await professionalRepo.findOneBy({
          id: userId,
          is_active: true,
        });

        if (!professional) {
          throw new NotFoundException(
            `Profesional con el UUID ${userId} no encontrado`,
          );
        }

        if (userRole !== ERole.ADMIN && 'role' in newProfileData) {
          throw new UnauthorizedException(
            'No tienes permiso para actualizar el rol del profesional',
          );
        }

        if (
          newProfileData.phone &&
          newProfileData.phone !== professional.phone
        ) {
          const existingProfessional = await professionalRepo.findOne({
            where: { phone: newProfileData.phone },
          });

          if (existingProfessional) {
            throw new ConflictException(
              'El número de teléfono ya está en uso por otro profesional',
            );
          }
        }

        let profilePictureUrl = professional.profile_picture;
        if (profilePicture) {
          profilePictureUrl = await this.filesService.uploadImageToCloudinary(
            profilePicture,
            userId,
          );
        }

        const updatedUser = professionalRepo.create({
          ...professional,
          ...newProfileData,
          profile_picture: profilePictureUrl,
        });

        await professionalRepo.save(updatedUser);

        return updatedUser;
      },
    );

    const transformedData = plainToInstance(
      ResponseProfessionalDto,
      queryResult,
      {
        excludeExtraneousValues: true,
      },
    );

    return {
      message: 'Perfil del psicólogo actualizado exitosamente',
      data: transformedData,
    };
  }
}
