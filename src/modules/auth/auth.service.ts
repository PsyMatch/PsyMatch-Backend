import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-auth.dto';
import bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signUpService(createAuthDto: CreateUserDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...userData } = createAuthDto;

    const existingUser = await this.userRepository.findOne({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists with this email');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    await this.userRepository.save(newUser);

    return {
      message: 'User successfully registered',
      data: newUser,
    };
  }

  signInService(signInAuthDto: SignInAuthDto) {
    const user: User | null = await this.userRepository.findOne({
      where: { email: signInAuthDto.email },
    });

    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }
  }
}
