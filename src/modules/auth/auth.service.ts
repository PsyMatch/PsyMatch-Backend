import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Patient } from '../users/entities/patient.entity';
import { Psychologist } from '../psychologist/entities/psychologist.entity';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { SignUpPsychologistDto } from './dto/signup-psychologist.dto';
import bcrypt from 'bcryptjs';
import { QueryHelper } from '../utils/helpers/query.helper';
import { FilesService } from '../files/files.service';
import { ERole } from '../../common/enums/role.enum';
import { EPsychologistStatus } from '../psychologist/enums/verified.enum';
import { Profile } from 'passport';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly queryHelper: QueryHelper,
    private readonly filesService: FilesService,
    private readonly userService: UsersService,
  ) {}

  private cleanEmptyStrings<T extends Record<string, unknown>>(
    obj: T,
  ): Partial<T> {
    const cleaned: Partial<T> = { ...obj };
    Object.keys(cleaned).forEach((key) => {
      if (cleaned[key as keyof T] === '' || cleaned[key as keyof T] === null) {
        delete cleaned[key as keyof T];
      }
    });
    return cleaned;
  }

  async signUpService(
    userData: SignUpDto,
    profilePicture?: Express.Multer.File,
  ): Promise<{ message: string; data: User; token: string }> {
    return this.queryHelper.runInTransaction(async (queryRunner) => {
      const userRepo = queryRunner.manager.getRepository(User);
      const patientRepo = queryRunner.manager.getRepository(Patient);
      const { email, phone, dni } = userData;

      const existingUserByEmail = await userRepo.findOne({
        where: { email, is_active: true },
      });
      if (existingUserByEmail) {
        throw new ConflictException('Email already exists');
      }

      if (dni) {
        const existingUserByDni = await userRepo.findOne({
          where: { dni, is_active: true },
        });
        if (existingUserByDni) {
          throw new ConflictException('DNI already exists');
        }
      }

      if (phone) {
        const existingUserByPhone = await userRepo.findOne({
          where: { phone, is_active: true },
        });
        if (existingUserByPhone) {
          throw new ConflictException('Phone number already exists');
        }
      }

      if (userData.password && userData.confirmPassword) {
        if (userData.password !== userData.confirmPassword) {
          throw new BadRequestException('Password confirmation does not match');
        }
      }

      let hashedPassword: string | undefined;
      if (userData.password) {
        hashedPassword = await bcrypt.hash(userData.password, 10);
      }

      const cleanedData = this.cleanEmptyStrings({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        birthdate: userData.birthdate,
        dni: userData.dni,
        health_insurance: userData.health_insurance,
        address: userData.address,
        emergency_contact: userData.emergency_contact,
        latitude: userData.latitude,
        longitude: userData.longitude,
        profile_picture: userData.profile_picture,
        password: hashedPassword,
        role: ERole.PATIENT,
      });

      const newUser = patientRepo.create(cleanedData);

      const savedUser = await patientRepo.save(newUser);

      if (profilePicture && savedUser.id) {
        const profilePictureUrl =
          await this.filesService.uploadImageToCloudinary(
            profilePicture,
            savedUser.id,
          );
        savedUser.profile_picture = profilePictureUrl;
        await patientRepo.save(savedUser);
      }

      const userWithRelations = await patientRepo.findOne({
        where: { id: savedUser.id },
      });

      if (!userWithRelations) {
        throw new BadRequestException('Error creating user');
      }

      const payload = {
        id: userWithRelations.id,
        email: userWithRelations.email,
        role: userWithRelations.role,
      };

      const token = this.jwtService.sign(payload);

      return {
        message: 'User successfully registered',
        data: userWithRelations,
        token,
      };
    });
  }

  async signUpPsychologistService(
    userData: SignUpPsychologistDto,
    profilePicture?: Express.Multer.File,
  ): Promise<{ message: string; data: User; token: string }> {
    return this.queryHelper.runInTransaction(async (queryRunner) => {
      const userRepo = queryRunner.manager.getRepository(User);
      const psychologistRepo = queryRunner.manager.getRepository(Psychologist);
      const { email, phone, dni } = userData;

      const existingUserByEmail = await userRepo.findOne({
        where: { email, is_active: true },
      });
      if (existingUserByEmail) {
        throw new ConflictException('Email already exists');
      }

      const existingUserByDni = await userRepo.findOne({
        where: { dni, is_active: true },
      });
      if (existingUserByDni) {
        throw new ConflictException('DNI already exists');
      }

      const existingUserByLicense = await psychologistRepo.findOne({
        where: { license_number: userData.license_number, is_active: true },
      });
      if (existingUserByLicense) {
        throw new ConflictException('License number already exists');
      }

      if (phone) {
        const existingUserByPhone = await userRepo.findOne({
          where: { phone, is_active: true },
        });
        if (existingUserByPhone) {
          throw new ConflictException('Phone number already exists');
        }
      }

      if (userData.password !== userData.confirmPassword)
        throw new BadRequestException('Password confirmation does not match');

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const { confirmPassword: _confirmPassword, ...psychologistData } =
        userData;

      const cleanedPsychologistData = this.cleanEmptyStrings({
        ...psychologistData,
        password: hashedPassword,
        role: ERole.PSYCHOLOGIST,
        verified: EPsychologistStatus.PENDING,
      });

      const newPsychologist = psychologistRepo.create(cleanedPsychologistData);

      const savedPsychologist = await psychologistRepo.save(newPsychologist);

      if (profilePicture && savedPsychologist.id) {
        const profilePictureUrl =
          await this.filesService.uploadImageToCloudinary(
            profilePicture,
            savedPsychologist.id,
          );
        savedPsychologist.profile_picture = profilePictureUrl;
        await psychologistRepo.save(savedPsychologist);
      }

      const psychologistForToken = await psychologistRepo.findOne({
        where: { id: savedPsychologist.id },
      });

      if (!psychologistForToken) {
        throw new BadRequestException('Error creating psychologist');
      }

      const payload = {
        id: psychologistForToken.id,
        email: psychologistForToken.email,
        role: psychologistForToken.role,
      };

      const token = this.jwtService.sign(payload);

      return {
        message: 'Psychologist successfully registered',
        data: psychologistForToken,
        token,
      };
    });
  }

  async signInService(
    userData: SignInDto,
  ): Promise<{ message: string; data: User; token: string }> {
    const { email, password } = userData;

    const user = await this.userRepository.findOne({
      where: { email },
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

  async validateOAuthLogin(oAuthUser: {
    provider: string;
    providerId: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    picture?: string;
    rawProfile?: Profile;
  }) {
    let user = await this.userService.findByProviderId(
      oAuthUser.provider,
      oAuthUser.providerId,
    );

    if (!user && oAuthUser.email) {
      user = await this.userService.findByEmail(oAuthUser.email);

      if (user) {
        user.provider = oAuthUser.provider;
        user.provider_id = oAuthUser.providerId;
        if (!user.profile_picture && oAuthUser.picture) {
          user.profile_picture = oAuthUser.picture;
        }
        await this.userService.save(user);
      }
    }

    if (!user) {
      user = await this.userService.createOAuthUser({
        email: oAuthUser.email,
        name: `${oAuthUser.firstName} ${oAuthUser.lastName}`.trim(),
        profile_picture: oAuthUser.picture,
        provider: oAuthUser.provider,
        provider_id: oAuthUser.providerId,
        is_active: true,
      });
    }

    return user;
  }

  loginWithAuth(userPayload: { id: number; email: string }) {
    const payload = {
      id: userPayload.id,
      email: userPayload.email,
    };

    return this.jwtService.sign(payload);
  }
}
