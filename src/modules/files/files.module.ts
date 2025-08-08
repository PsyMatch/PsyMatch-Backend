import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import cloudinary from '../../configs/cloudinary.config';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { QueryHelper } from '../utils/helpers/query.helper';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [FilesController],
  providers: [FilesService, JwtService, QueryHelper, cloudinary],
  exports: [FilesService],
})
export class FilesModule {}
