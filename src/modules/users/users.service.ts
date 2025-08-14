import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
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
import { ResponseUserDto } from './dto/response-user.dto';
import { Payment } from '../payments/entities/payment.entity';
import { Appointment } from '../appointments/entities/appointment.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly queryHelper: QueryHelper,
    private readonly paginationService: PaginationService,

    // CODIGO DE PEDRO//////////////////////////////////////////////
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,
    ////////////////////////////////////////////////////////////////
  ) {}

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<User>> {
    const queryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .where('user.is_active = :isActive', { isActive: true });

    return await this.paginationService.paginate(queryBuilder, paginationDto);
  }

  async findAllPatients(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<User>> {
    const queryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .where('user.role = :role', { role: ERole.PATIENT })
      .andWhere('user.is_active = :isActive', { isActive: true });

    return await this.paginationService.paginate(queryBuilder, paginationDto);
  }

  async findById(id: string): Promise<User> {
    const user: User | null = await this.usersRepository.findOne({
      where: { id, is_active: true },
    });

    if (!user) {
      throw new NotFoundException(`User with UUID ${id} not found`);
    }

    return user;
  }

  async update(
    id: string,
    userData: UpdateUserDto,
    userIdFromToken: string,
    userRole: ERole,
  ): Promise<string> {
    return this.queryHelper.runInTransaction(async (queryRunner) => {
      const userRepo = queryRunner.manager.getRepository(User);

      const user = await userRepo.findOneBy({ id, is_active: true });
      if (!user) {
        throw new NotFoundException(`User with UUID ${id} not found`);
      }

      if (userRole !== ERole.ADMIN && userIdFromToken !== id) {
        throw new UnauthorizedException('You cannot update another user');
      }

      if (userRole !== ERole.ADMIN && 'role' in userData) {
        throw new UnauthorizedException('You cannot change your admin status');
      }

      if (userData.phone && userData.phone !== user.phone) {
        const existingUser = await userRepo.findOne({
          where: { phone: userData.phone, is_active: true },
        });

        if (existingUser && existingUser.id !== id) {
          throw new ConflictException('El número de teléfono ya existe');
        }
      }

      const updatedUser = userRepo.create({
        ...user,
        ...userData,
      });

      await userRepo.save(updatedUser);

      return updatedUser.id;
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
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      if (userRole !== ERole.ADMIN && userIdFromToken !== id) {
        throw new UnauthorizedException('You cannot delete another user');
      }

      user.is_active = false;
      await userRepo.save(user);

      return user.id;
    });
  }

  //CODIGO ESCRITO POR PEDRO, NECESARIO PARA LA AUTENTICACION DE TERCEROS

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

  ////////////////////////////////////////////////////////////////////

  // SEGUNDO CODIGO DE PEDRO PEDIDO POR MAURI

  ///////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////
  async getPsychologistsForPatient(
    userId: string,
  ): Promise<{ message: string; data: ResponseUserDto[] }> {
    const appointments = await this.appointmentRepository.find({
      where: { patient: { id: userId } },
      relations: ['psychologist'],
    });

    if (!appointments || appointments.length === 0) {
      throw new NotFoundException(
        'No se encontraron pacientes o turnos de este usuario',
      );
    }

    const patients = appointments.map((appointment) => appointment.patient);

    if (!patients.length) {
      throw new NotFoundException(
        'No hay pacientes disponibles para este psicólogo',
      );
    }

    return { message: 'Pacientes recuperados exitosamente', data: patients };
  }

  async getPaymentsOfPatient(
    userId: string,
  ): Promise<{ message: string; data: Payment[] }> {
    const payments = await this.paymentsRepository
      .createQueryBuilder('payment')
      .innerJoinAndSelect(
        'appointments',
        'appointment',
        'payment.appointment_id = appointment.id',
      )
      .where('appointment."psychologistId" = :userId', {
        userId,
      })
      .getMany();

    if (!payments || payments.length === 0) {
      throw new NotFoundException('No se encontraron pagos para este usuario');
    }

    return { message: 'Pagos recuperados exitosamente', data: payments };
  }
}
