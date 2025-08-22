import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryHelper } from '../utils/helpers/query.helper';
import { ERole } from '../../common/enums/role.enum';
import { PaginationService } from '../../common/services/pagination.service';
import {
  PaginationDto,
  PaginatedResponse,
} from '../../common/dto/pagination.dto';
import { Payment } from '../payments/entities/payment.entity';
import { Appointment } from '../appointments/entities/appointment.entity';
import { Psychologist } from '../psychologist/entities/psychologist.entity';
import { FilesService } from '../files/files.service';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import lodash from 'lodash';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,
    private readonly queryHelper: QueryHelper,
    private readonly paginationService: PaginationService,
    private readonly filesService: FilesService,
  ) {}

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<Omit<User, 'password'>>> {
    const usersQuery = this.usersRepository
      .createQueryBuilder('user')
      .where('user.is_active = :isActive', { isActive: true });

    const paginatedResult = await this.paginationService.paginate(
      usersQuery,
      paginationDto,
    );

    if (!paginatedResult.data.length) {
      throw new NotFoundException('No se encontraron usuarios activos');
    }

    paginatedResult.data = paginatedResult.data.map(
      ({ password: _password, ...rest }) => rest,
    ) as Omit<User[], 'password'>;

    return paginatedResult;
  }

  async findAllPatients(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<User>> {
    const patients = this.usersRepository
      .createQueryBuilder('user')
      .where('user.role = :role', { role: ERole.PATIENT })
      .andWhere('user.is_active = :isActive', { isActive: true });

    const paginatedResult = await this.paginationService.paginate(
      patients,
      paginationDto,
    );

    if (!paginatedResult.data.length) {
      throw new NotFoundException('No se encontraron pacientes activos');
    }

    paginatedResult.data = paginatedResult.data.map(
      ({ password: _password, ...rest }) => rest,
    ) as Omit<User[], 'password'>;

    return paginatedResult;
  }

  async findById(id: string, requester?: string): Promise<User> {
    const user: User | null = await this.usersRepository.findOne({
      where: { id, is_active: true },
    });

    if (!user) {
      throw new NotFoundException('No se encontró usuario con ese ID');
    }

    if (user.role === ERole.ADMIN && (!requester || requester !== user.id)) {
      throw new NotFoundException('No se encontró usuario con ese ID');
    }

    return user;
  }

  async getMyPsychologists(
    id: string,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<Psychologist>> {
    const user: User | null = await this.usersRepository.findOne({
      where: { id, is_active: true },
    });

    if (!user) {
      throw new NotFoundException('No se encontró usuario con ese ID');
    }

    const appointments = this.appointmentRepository.manager
      .getRepository(Psychologist)
      .createQueryBuilder('psychologist')
      .innerJoin('psychologist.appointments', 'appointment')
      .where('appointment.patientId = :id', { id })
      .groupBy('psychologist.id');

    const result = await this.paginationService.paginate(
      appointments,
      paginationDto,
    );

    if (!result.data.length) {
      throw new NotFoundException(
        'Este paciente aún no tiene psicólogos asignados',
      );
    }

    return result;
  }

  async getMyAppointments(
    id: string,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<Appointment>> {
    const user: User | null = await this.usersRepository.findOne({
      where: { id, is_active: true },
    });

    if (!user) {
      throw new NotFoundException('No se encontró usuario con ese ID');
    }

    const appointmentsQuery = this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect('appointment.psychologist', 'psychologist')
      .where('patient.id = :id OR psychologist.id = :id', { id })
      .orderBy('appointment.date', 'ASC');

    const result = await this.paginationService.paginate(
      appointmentsQuery,
      paginationDto,
    );

    if (!result.data.length) {
      throw new NotFoundException(
        'Este paciente aún no tiene citas registradas',
      );
    }

    result.data = result.data.map((appointment: Appointment) => ({
      ...appointment,
      patient: appointment.patient,
      psychologist: appointment.psychologist,
    }));

    return result;
  }

  async getMyPayments(
    id: string,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<Payment>> {
    const user: User | null = await this.usersRepository.findOne({
      where: { id, is_active: true },
    });

    if (!user) {
      throw new NotFoundException('No se encontró usuario con ese ID');
    }

    const payments = this.paymentsRepository
      .createQueryBuilder('payment')
      .innerJoinAndSelect(
        'appointments',
        'appointment',
        'payment.appointment_id = appointment.id',
      )
      .where('appointment."psychologistId" = :id', {
        id,
      });

    const result = await this.paginationService.paginate(
      payments,
      paginationDto,
    );

    if (!result.data.length) {
      throw new NotFoundException(
        'Este paciente aún no tiene pagos registrados',
      );
    }

    return result;
  }

  async update(
    id: string,
    userData: UpdateUserDto,
    userIdFromToken: string,
    userRole: ERole,
    profilePicture?: Express.Multer.File,
  ): Promise<Omit<User, 'password'>> {
    const DEFAULT_PROFILE_URL =
      'https://res.cloudinary.com/dibnkd72j/image/upload/v1755495603/default-pacient-profile-picture_kqpobf.webp';
    return this.queryHelper.runInTransaction(async (queryRunner) => {
      const userRepo = queryRunner.manager.getRepository(User);
      const user: User | null = await this.usersRepository.findOne({
        where: { id, is_active: true },
      });

      if (!user) {
        throw new BadRequestException('No se encontró usuario con ese ID');
      }

      if (
        user.role === ERole.ADMIN &&
        (!userIdFromToken || userIdFromToken !== user.id)
      ) {
        throw new NotFoundException('No se encontró usuario con ese ID');
      }

      if (userRole !== ERole.ADMIN && userIdFromToken !== id)
        throw new UnauthorizedException('No puedes actualizar otro usuario');
      if (userRole !== ERole.ADMIN && 'role' in userData)
        throw new UnauthorizedException(
          'No puedes cambiar tu rol de administrador',
        );

      if (userData.phone && userData.phone !== user.phone) {
        const existingUser = await userRepo.findOne({
          where: { phone: userData.phone, is_active: true },
        });
        if (existingUser && existingUser.id !== id)
          throw new ConflictException('El número de teléfono ya existe');
      }
      if (userData.email && userData.email !== user.email) {
        const existingUser = await userRepo.findOne({
          where: { email: userData.email, is_active: true },
        });
        if (existingUser && existingUser.id !== id)
          throw new ConflictException('El correo electrónico ya existe');
      }

      if (!userData.address) {
        userData.latitude = undefined;
        userData.longitude = undefined;
      }

      const filtered = lodash.pickBy(
        userData,
        (v, k) => v !== undefined && k !== 'profile_picture',
      );

      const normalized = Object.fromEntries(
        Object.entries(filtered).map(([k, v]) => [k, v ?? null]),
      );

      const userNormalized = Object.fromEntries(
        Object.entries(normalized).map(([k]) => [k, user[k] ?? null]),
      );

      const hasDataChanges = !lodash.isEqual(userNormalized, normalized);

      let profilePictureChanged = false;
      let newProfilePictureUrl: string | undefined;

      if (profilePicture) {
        const newFileHash = crypto
          .createHash('md5')
          .update(profilePicture.buffer)
          .digest('hex');

        let currentFileHash: string | null = null;

        if (
          user.profile_picture &&
          user.profile_picture !== DEFAULT_PROFILE_URL
        ) {
          const response = await fetch(user.profile_picture);
          if (response.ok) {
            const currentBuffer = Buffer.from(await response.arrayBuffer());
            currentFileHash = crypto
              .createHash('md5')
              .update(currentBuffer)
              .digest('hex');
          } else {
            currentFileHash = null;
          }
        }
        if (newFileHash !== currentFileHash) {
          newProfilePictureUrl =
            await this.filesService.uploadImageToCloudinary(profilePicture, id);
          profilePictureChanged = true;
        }
      } else if (
        'profile_picture' in userData &&
        (userData.profile_picture === '' ||
          userData.profile_picture === null ||
          userData.profile_picture === undefined)
      ) {
        if (user.profile_picture !== DEFAULT_PROFILE_URL) {
          newProfilePictureUrl = DEFAULT_PROFILE_URL;
          profilePictureChanged = true;
        }
      }

      if (!hasDataChanges && !profilePictureChanged) {
        throw new ConflictException('No se actualizaron campos');
      }

      let userDataToSave = { ...lodash.omit(userData, ['profile_picture']) };

      if (userData.password) {
        userDataToSave.password = await bcrypt.hash(userData.password, 10);
      }

      const updatedUser = userRepo.create({
        ...user,
        ...userDataToSave,
        profile_picture: newProfilePictureUrl ?? user.profile_picture,
      });
      await userRepo.save(updatedUser);

      const userUpdated = await userRepo.findOne({
        where: { id, is_active: true },
      });
      if (!userUpdated)
        throw new NotFoundException('No se encontró usuario actualizado');

      const { password: _password, ...userWithoutPassword } = userUpdated;
      return userWithoutPassword;
    });
  }

  async delete(
    id: string,
    userIdFromToken: string,
    userRole: ERole,
  ): Promise<string> {
    return this.queryHelper.runInTransaction(async (queryRunner) => {
      const userRepo = queryRunner.manager.getRepository(User);

      const user = await userRepo.findOneBy({ id, is_active: true });

      if (!user) {
        throw new BadRequestException('No se encontró usuario con ese ID');
      }

      if (
        user.role === ERole.ADMIN &&
        (!userIdFromToken || userIdFromToken !== user.id)
      ) {
        throw new NotFoundException('No se encontró usuario con ese ID');
      }

      if (userRole !== ERole.ADMIN && userIdFromToken !== id) {
        throw new UnauthorizedException(
          'No tienes permiso para acceder o modificar este recurso',
        );
      }

      user.is_active = false;
      await userRepo.save(user);

      return user.id;
    });
  }

  async findByProviderId(
    provider: string,
    providerId: string,
  ): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { provider, provider_id: providerId },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
    });
  }

  async createOAuthUser(userData: Partial<User>): Promise<User> {
    const userDataWithDefaults = {
      ...userData,
      role: userData.role || ERole.PATIENT,
      verified: null,
    };

    const user = this.usersRepository.create(userDataWithDefaults);
    return this.usersRepository.save(user);
  }

  async save(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }
}
