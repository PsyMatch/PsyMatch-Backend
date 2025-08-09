import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { Patient } from './entities/patient.entity';
import { Psychologist } from '../psychologist/entities/psychologist.entity';
import { JwtService } from '@nestjs/jwt';
import { FilesModule } from '../files/files.module';
import { PaginationService } from '../../common/services/pagination.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Patient, Psychologist]),
    FilesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtService, PaginationService],
  exports: [UsersService],
})
export class UsersModule {}
