import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryHelper } from '../utils/helpers/query.helper';
import { ERole } from './enums/role.enum';
import { FilesService } from '../files/files.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly queryHelper: QueryHelper,
    private readonly filesService: FilesService,
  ) {}

  async findAll(page: number, limit: number): Promise<User[]> {
    const [users, total] = await this.usersRepository.findAndCount({
      where: { is_active: true },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['professionals'],
    });

    if (!total) throw new NotFoundException('There are currently no users');

    const totalPages = Math.ceil(total / limit);

    if (page > totalPages && total > 0) {
      throw new BadRequestException(
        `The requested page (${page}) exceeds the maximum (${totalPages})`,
      );
    }

    return users;
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id, is_active: true },
      relations: ['professionals'],
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

      if (userRole === ERole.PATIENT && userIdFromToken !== id) {
        throw new UnauthorizedException('You cannot update another user');
      }

      if (userRole !== ERole.ADMIN && 'role' in userData) {
        throw new UnauthorizedException('You cannot change your admin status');
      }

      const { professionals: _professionals, ...restUserData } = userData;

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

      if (userRole === ERole.PATIENT && userIdFromToken !== id) {
        throw new UnauthorizedException('You cannot delete another user');
      }

      user.is_active = false;
      await userRepo.save(user);

      return user.id;
    });
  }

  async updateProfilePicture(
    id: string,
    file: Express.Multer.File,
    userIdFromToken: string,
    userRole: ERole,
  ): Promise<{ id: string; profile_picture: string }> {
    return this.queryHelper.runInTransaction(async (queryRunner) => {
      const userRepo = queryRunner.manager.getRepository(User);

      const user = await userRepo.findOneBy({ id, is_active: true });
      if (!user) {
        throw new NotFoundException(`User with UUID ${id} not found`);
      }

      // Authorization check
      if (userRole === ERole.PATIENT && userIdFromToken !== id) {
        throw new UnauthorizedException(
          "You cannot update another user's profile picture",
        );
      }

      // Upload image to Cloudinary
      const optimizedUrl = await this.filesService.uploadImageToCloudinary(
        file,
        id,
      );

      // Update user profile picture
      user.profile_picture = optimizedUrl;
      await userRepo.save(user);

      return {
        id: user.id,
        profile_picture: user.profile_picture,
      };
    });
  }
}
