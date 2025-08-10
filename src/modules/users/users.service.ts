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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly queryHelper: QueryHelper,
    private readonly paginationService: PaginationService,
  ) {}

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<User>> {
    const queryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .where('user.is_active = :isActive', { isActive: true })
      .leftJoinAndSelect('user.psychologists', 'psychologists')
      .leftJoinAndSelect('user.patients', 'patients');

    return await this.paginationService.paginate(queryBuilder, paginationDto);
  }

  async findAllPatients(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<User>> {
    const queryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .where('user.role = :role', { role: ERole.PATIENT })
      .andWhere('user.is_active = :isActive', { isActive: true })
      .leftJoinAndSelect('user.psychologists', 'psychologists');

    return await this.paginationService.paginate(queryBuilder, paginationDto);
  }

  async findById(id: string): Promise<User> {
    let user: User | null = await this.usersRepository.findOne({
      where: { id, is_active: true, role: ERole.PATIENT },
      relations: ['psychologists'],
    });

    if (user) {
      return user;
    }

    user = await this.usersRepository.findOne({
      where: { id, is_active: true, role: ERole.PSYCHOLOGIST },
      relations: ['patients'],
    });

    if (user) {
      return user;
    }

    user = await this.usersRepository.findOne({
      where: { id, is_active: true, role: ERole.ADMIN },
      relations: ['psychologists'],
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
          throw new ConflictException('Phone number already exists');
        }
      }

      const { psychologists: _psychologists, ...restUserData } = userData;

      const updatedUser = userRepo.create({
        ...user,
        ...restUserData,
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
}
