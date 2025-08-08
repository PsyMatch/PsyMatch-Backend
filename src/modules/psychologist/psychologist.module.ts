import { Module } from '@nestjs/common';
import { PsychologistService } from './psychologist.service';
import { PsychologistController } from './psychologist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Psychologist } from './entities/psychologist.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User, Psychologist])],
  controllers: [PsychologistController],
  providers: [PsychologistService, JwtService],
})
export class PsychologistModule {}
