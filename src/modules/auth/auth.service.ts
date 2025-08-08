import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import bcrypt from 'bcryptjs';
import { QueryHelper } from '../utils/helpers/query.helper';
import { FilesService } from '../files/files.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly queryHelper: QueryHelper,
    private readonly filesService: FilesService,
  ) {}

  async signUpService(
    userData: SignUpDto,
    profilePicture?: Express.Multer.File,
  ): Promise<User> {
    return this.queryHelper.runInTransaction(async (queryRunner) => {
      const userRepo = queryRunner.manager.getRepository(User);
      const { email, phone } = userData;

      const existingUser = await userRepo.findOne({
        where: [{ email }, { phone }],
      });
      // TEST
      if (existingUser) {
        throw new ConflictException(
          'User with this email or phone number already exists',
        );
      }

      if (userData.password !== userData.confirmPassword)
        throw new BadRequestException('Password confirmation does not match');

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const newUser = userRepo.create({
        ...userData,
        password: hashedPassword,
      });

      const savedUser = await userRepo.save(newUser);

      // Manejar la subida de imagen si está presente
      if (profilePicture && savedUser.id) {
        const profilePictureUrl =
          await this.filesService.uploadImageToCloudinary(
            profilePicture,
            savedUser.id,
          );
        savedUser.profile_picture = profilePictureUrl;
        await userRepo.save(savedUser);
      }

      // Cargar el usuario con sus relaciones para el ResponseDto
      const userWithRelations = await userRepo.findOne({
        where: { id: savedUser.id },
        relations: ['professionals'],
      });

      if (!userWithRelations) {
        throw new BadRequestException('Error creating user');
      }

      return userWithRelations;
    });
  }

  async signInService(
    userData: SignInDto,
  ): Promise<{ message: string; data: User; token: string }> {
    const { email, password } = userData;

    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['professionals'],
    });

    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password');
    }

    user.last_login = new Date();
    await this.userRepository.save(user);

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    return {
      message: 'User successfully logged in',
      data: user,
      token,
    };
  }
}
