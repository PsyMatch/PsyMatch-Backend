import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationService } from 'src/common/services/pagination.service';
import {
  PaginatedResponse,
  PaginationDto,
} from 'src/common/dto/pagination.dto';
import { plainToInstance } from 'class-transformer';
import { Reviews } from 'src/modules/reviews/entities/reviews.entity';
import { ERole } from 'src/common/enums/role.enum';
import { QueryHelper } from 'src/modules/utils/helpers/query.helper';
import { FilesService } from 'src/modules/files/files.service';
import { Payment } from 'mercadopago';
import { ResponseUserDto } from 'src/modules/users/dto/response-user.dto';
import { Appointment } from 'src/modules/appointments/entities/appointment.entity';
import { Psychologist } from './entities/psychologist.entity';
import { ResponseProfessionalDto } from './dto/response-professional.dto';
import { EPsychologistStatus } from './enums/verified.enum';
import { UpdatePsychologistDto } from './dto/update-psychologist.dto';

@Injectable()
export class PsychologistService {
  constructor(
    @InjectRepository(Psychologist)
    private readonly psychologistRepository: Repository<Psychologist>,
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,
    @InjectRepository(Appointment)
    private readonly appointmentsRepository: Repository<Appointment>,
    @InjectRepository(Reviews)
    private readonly reviewsRepository: Repository<Reviews>,
    private readonly paginationService: PaginationService,
    private readonly queryHelper: QueryHelper,
    private readonly filesService: FilesService,
  ) {}

  async getAllVerifiedService(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<ResponseProfessionalDto>> {
    const queryBuilder =
      this.psychologistRepository.createQueryBuilder('psychologist');
    queryBuilder.where('psychologist.verified = :status', {
      status: EPsychologistStatus.VALIDATED,
    });

    const paginatedResult = await this.paginationService.paginate(
      queryBuilder,
      paginationDto,
    );

    const transformedItems = plainToInstance(
      ResponseProfessionalDto,
      paginatedResult.data,
      {
        excludeExtraneousValues: true,
      },
    );

    return {
      ...paginatedResult,
      data: transformedItems,
    };
  }

  async findAll(userId: string): Promise<{ message: string; data: Reviews }> {
    const reviews = await this.reviewsRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!reviews) {
      throw new NotFoundException('Reseñas no encontradas');
    }

    return { message: 'Reseñas encontradas', data: reviews };
  }

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

  async getPaymentsOfProfessional(
    psychologistId: string,
  ): Promise<{ message: string; data: Payment[] }> {
    const payments = await this.paymentsRepository
      .createQueryBuilder('payment')
      .innerJoinAndSelect(
        'appointments',
        'appointment',
        'payment.appointment_id = appointment.id',
      )
      .where('appointment."psychologistId" = :psychologistId', {
        psychologistId,
      })
      .getMany();

    if (!payments || payments.length === 0) {
      throw new NotFoundException(
        'No se encontraron pagos para este psicólogo',
      );
    }

    return { message: 'Pagos recuperados exitosamente', data: payments };
  }

  async getPatientsForPsychologist(
    userId: string,
  ): Promise<{ message: string; data: ResponseUserDto[] }> {
    const appointments = await this.getAppointmentsOfProfessional(userId);

    const { data } = appointments;

    if (!data || data.length === 0) {
      throw new NotFoundException(
        'No hay citas disponibles para este psicólogo',
      );
    }

    const patients = data.map((appointment) => appointment.patient);

    if (!patients.length) {
      throw new NotFoundException(
        'No hay pacientes disponibles para este psicólogo',
      );
    }

    const transformedData = plainToInstance(ResponseUserDto, patients);

    return {
      message: 'Pacientes recuperados exitosamente',
      data: transformedData,
    };
  }

  async getAppointmentsOfProfessional(
    psychoId: string,
  ): Promise<{ message: string; data: Appointment[] }> {
    const appointments = await this.appointmentsRepository.find({
      where: { psychologist: { id: psychoId } },
      relations: ['patient'],
    });

    if (!appointments || appointments.length === 0) {
      throw new NotFoundException(
        'No se encontraron pacientes o turnos de este psicologo',
      );
    }

    return { message: 'Citas recuperadas exitosamente', data: appointments };
  }
}
