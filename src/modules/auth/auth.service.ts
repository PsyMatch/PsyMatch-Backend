import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
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
import { IJwtPayload } from './interfaces/jwt-payload.interface';
import { EmailsService } from '../emails/emails.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly queryHelper: QueryHelper,
    private readonly filesService: FilesService,
    private readonly userService: UsersService,
    private readonly emailsService: EmailsService,
  ) {}

  async signUpService(
    userData: SignUpDto,
    profilePicture?: Express.Multer.File,
  ): Promise<{ message: string; data: Patient; token: string }> {
    return this.queryHelper.runInTransaction(async (queryRunner) => {
      const userRepo = queryRunner.manager.getRepository(User);
      const patientRepo = queryRunner.manager.getRepository(Patient);
      const { email, dni } = userData;

      const existingUserByEmail = await userRepo.findOne({
        where: { email, is_active: true },
      });
      if (existingUserByEmail) {
        throw new ConflictException('El email ya existe');
      }

      if (dni) {
        const existingUserByDni = await userRepo.findOne({
          where: { dni, is_active: true },
        });
        if (existingUserByDni) {
          throw new ConflictException('El DNI ya existe');
        }
      }

      if (userData.password && userData.confirmPassword) {
        if (userData.password !== userData.confirmPassword) {
          throw new BadRequestException(
            'La confirmación de contraseña no coincide',
          );
        }
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const newUser = patientRepo.create({
        ...userData,
        password: hashedPassword,
        role: ERole.PATIENT,
      });

      const savedUser = await patientRepo.save(newUser);

      const defaultProfilePicUrl =
        'https://res.cloudinary.com/dibnkd72j/image/upload/v1755495603/default-pacient-profile-picture_kqpobf.webp';

      if (profilePicture && savedUser.id) {
        const profilePictureUrl =
          await this.filesService.uploadImageToCloudinary(
            profilePicture,
            savedUser.id,
          );
        savedUser.profile_picture = profilePictureUrl;
        await patientRepo.save(savedUser);
      } else if (!profilePicture && savedUser.id) {
        savedUser.profile_picture = defaultProfilePicUrl;
        await patientRepo.save(savedUser);
      }

      if (!savedUser) {
        throw new BadRequestException('Error al crear el usuario');
      }

      const payload = {
        id: savedUser.id,
        email: savedUser.email,
        role: savedUser.role,
      };

      const token = this.jwtService.sign(payload);

      return {
        message: 'Paciente registrado exitosamente',
        data: savedUser,
        token,
      };
    });
  }

  async signUpPsychologistService(
    psychologistData: SignUpPsychologistDto,
    profilePicture?: Express.Multer.File,
  ): Promise<{ message: string; data: Psychologist; token: string }> {
    return this.queryHelper.runInTransaction(async (queryRunner) => {
      const userRepo = queryRunner.manager.getRepository(User);
      const psychologistRepo = queryRunner.manager.getRepository(Psychologist);
      const { email, dni } = psychologistData;

      const existingUserByEmail = await userRepo.findOne({
        where: { email, is_active: true },
      });
      if (existingUserByEmail) {
        throw new ConflictException('El email ya existe');
      }

      const existingUserByDni = await userRepo.findOne({
        where: { dni, is_active: true },
      });
      if (existingUserByDni) {
        throw new ConflictException('El DNI ya existe');
      }

      const existingUserByLicense = await psychologistRepo.findOne({
        where: {
          license_number: psychologistData.license_number,
          is_active: true,
        },
      });
      if (existingUserByLicense) {
        throw new ConflictException('El número de matrícula ya existe');
      }

      if (psychologistData.password !== psychologistData.confirmPassword)
        throw new BadRequestException(
          'La confirmación de contraseña no coincide',
        );

      const hashedPassword = await bcrypt.hash(psychologistData.password, 10);

      const newPsychologist = psychologistRepo.create({
        ...psychologistData,
        password: hashedPassword,
        role: ERole.PSYCHOLOGIST,
        verified: EPsychologistStatus.PENDING,
      });

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

      if (!savedPsychologist) {
        throw new BadRequestException('Error al crear el psicólogo');
      }

      const payload = {
        id: savedPsychologist.id,
        email: savedPsychologist.email,
        role: savedPsychologist.role,
      };

      const token = this.jwtService.sign(payload);

      return {
        message: 'Psicólogo registrado exitosamente',
        data: savedPsychologist,
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
      throw new BadRequestException('Email o contraseña inválidos');
    }

    if (!user.is_active) {
      throw new UnauthorizedException(
        'Tu cuenta ha sido suspendida. Contacta al administrador.',
      );
    }

    if (!user.password || typeof user.password !== 'string') {
      throw new BadRequestException(
        'Este usuario debe iniciar sesión con Google o el método de autenticación correspondiente.',
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Email o contraseña inválidos');
    }

    await this.userRepository.update(user.id, { last_login: new Date() });

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    return {
      message: 'Usuario logueado exitosamente',
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

    if (!user.is_active) {
      throw new UnauthorizedException(
        'Tu cuenta ha sido suspendida. Contacta al administrador.',
      );
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

  async forgotPassword(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const payload = { id: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });

    await this.emailsService.sendNewPasswordEmail(email, token);

    return {
      message:
        'Se envió un correo con instrucciones para reestablecer la contraseña',
    };
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = await this.jwtService.verifyAsync<IJwtPayload>(token);

      const user = await this.userRepository.findOne({
        where: { id: payload.id },
      });

      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      user.password = await bcrypt.hash(newPassword, 10);

      await this.userRepository.save(user);

      await this.emailsService.sendPasswordChangedEmail(user.email);

      return { message: 'Contraseña modificada exitosamente' };
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
