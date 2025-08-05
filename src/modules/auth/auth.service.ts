import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signUpService(userData: SignUpDto) {
    const { confirmPassword: _, ...rest } = userData;

    const existingUser = await this.userRepository.findOne({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists with this email');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = this.userRepository.create({
      ...rest,
      password: hashedPassword,
    });

    await this.userRepository.save(newUser);

    return {
      message: 'User successfully registered',
      data: newUser,
    };
  }

  async signInService(signInAuthDto: SignInDto) {
    const user: User | null = await this.userRepository.findOne({
      where: { email: signInAuthDto.email },
    });

    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(
      signInAuthDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password');
    }

    const payload = {
      sub: user.user_id,
      email: user.email,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    return {
      message: 'User successfully logged in',
      token,
    };
  }
}
