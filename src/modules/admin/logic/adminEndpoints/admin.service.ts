import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import {
  PaginatedResponse,
  PaginationDto,
} from 'src/common/dto/pagination.dto';
import { ERole } from 'src/common/enums/role.enum';
import { PaginationService } from 'src/common/services/pagination.service';
import { ResponseProfessionalDto } from 'src/modules/psychologist/dto/response-professional.dto';
import { Psychologist } from 'src/modules/psychologist/entities/psychologist.entity';
import { EPsychologistStatus } from 'src/modules/psychologist/enums/verified.enum';
import { ResponseUserDto } from 'src/modules/users/dto/response-user.dto';
import { User } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Psychologist)
    private readonly psychologistRepository: Repository<Psychologist>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly paginationService: PaginationService,
  ) {}

  async getAllVerifiedRequestService(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<ResponseProfessionalDto>> {
    const queryBuilder =
      this.psychologistRepository.createQueryBuilder('psychologist');
    queryBuilder.where('psychologist.verified = :status', {
      status: EPsychologistStatus.PENDING,
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

  async findOne(
    id: string,
  ): Promise<{ message: string; data: ResponseProfessionalDto }> {
    const psychologist = await this.psychologistRepository.findOne({
      where: { id, is_active: true },
    });

    if (!psychologist) {
      throw new NotFoundException('No se encontró el psicólogo');
    }

    if (psychologist.verified !== EPsychologistStatus.PENDING) {
      throw new NotFoundException(
        'El psicólogo ya está verificado o no está pendiente de verificación',
      );
    }

    psychologist.verified = EPsychologistStatus.VALIDATED;
    const savedPsychologist =
      await this.psychologistRepository.save(psychologist);

    const transformedPsychologist = plainToInstance(
      ResponseProfessionalDto,
      savedPsychologist,
      {
        excludeExtraneousValues: true,
      },
    );

    return {
      message: 'Psicólogo verificado exitosamente',
      data: transformedPsychologist,
    };
  }

  async rejectPsychologistById(
    id: string,
  ): Promise<{ message: string; data: ResponseProfessionalDto }> {
    const psychologist = await this.psychologistRepository.findOne({
      where: { id, is_active: true },
    });

    if (!psychologist) {
      throw new NotFoundException('No se encontró el psicólogo');
    }

    psychologist.verified = EPsychologistStatus.REJECTED;
    const savedPsychologist =
      await this.psychologistRepository.save(psychologist);

    const transformedPsychologist = plainToInstance(
      ResponseProfessionalDto,
      savedPsychologist,
      {
        excludeExtraneousValues: true,
      },
    );

    return {
      message: 'Psicólogo rechazado exitosamente',
      data: transformedPsychologist,
    };
  }

  async promoteUserById(
    id: string,
  ): Promise<{ message: string; data: ResponseUserDto }> {
    const user = await this.userRepository.findOne({
      where: { id, is_active: true },
    });

    if (!user) {
      throw new NotFoundException('No se encontró el usuario');
    }
    if (user.role === ERole.ADMIN) {
      throw new NotFoundException('El usuario ya es un administrador');
    }

    await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ role: ERole.ADMIN })
      .where('id = :id', { id })
      .execute();

    const updatedUser = await this.userRepository.findOne({
      where: { id },
    });

    const transformedUser = plainToInstance(ResponseUserDto, updatedUser, {
      excludeExtraneousValues: true,
    });

    return {
      message: 'Usuario promovido exitosamente',
      data: transformedUser,
    };
  }

  async banUserById(
    id: string,
  ): Promise<{ message: string; data: ResponseUserDto }> {
    const user = await this.userRepository.findOne({
      where: { id, is_active: true },
    });

    if (!user) {
      throw new NotFoundException('No se encontró el usuario');
    }

    user.is_active = false;
    const savedUser = await this.userRepository.save(user);

    const transformedUser = plainToInstance(ResponseUserDto, savedUser, {
      excludeExtraneousValues: true,
    });

    return {
      message: 'Usuario baneado exitosamente',
      data: transformedUser,
    };
  }

  async getBannedUsersService(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<ResponseUserDto>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    queryBuilder.where('user.is_active = :isActive', { isActive: false });

    const paginatedResult = await this.paginationService.paginate(
      queryBuilder,
      paginationDto,
    );

    const transformedItems = plainToInstance(
      ResponseUserDto,
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

  async unbanUserById(
    id: string,
  ): Promise<{ message: string; data: ResponseUserDto }> {
    const user = await this.userRepository.findOne({
      where: { id, is_active: false },
    });

    if (!user) {
      throw new NotFoundException('No se encontró el usuario');
    }

    user.is_active = true;
    const savedUser = await this.userRepository.save(user);

    const transformedUser = plainToInstance(ResponseUserDto, savedUser, {
      excludeExtraneousValues: true,
    });

    return {
      message: 'Usuario desbaneado exitosamente',
      data: transformedUser,
    };
  }

  async getBannedUsersService(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<ResponseUserDto>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    queryBuilder.where('user.is_active = :isActive', { isActive: false });

    const paginatedResult = await this.paginationService.paginate(
      queryBuilder,
      paginationDto,
    );

    const transformedItems = plainToInstance(
      ResponseUserDto,
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
}
