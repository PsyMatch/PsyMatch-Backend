import { Module } from '@nestjs/common';
import { MapsService } from './maps.service';
import { MapsController } from './maps.controller';
import { UsersModule } from '../users/users.module';
import { JwtService } from '@nestjs/jwt';
import { QueryHelper } from '../utils/helpers/query.helper';
import { PsychologistModule } from '../psychologist/psychologist.module';

@Module({
  imports: [UsersModule, PsychologistModule],
  providers: [MapsService, JwtService, QueryHelper],
  controllers: [MapsController],
  exports: [MapsService],
})
export class MapsModule {}
