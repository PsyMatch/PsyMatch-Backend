import { Module, OnModuleInit } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Psychologist } from '../psychologist/entities/psychologist.entity';
import { Patient } from '../users/entities/patient.entity';
import { Admin } from '../users/entities/admin.entity';
import { envs } from 'src/configs/envs.config';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, Admin, Psychologist])],
  providers: [SeederService],
})
export class SeederModule implements OnModuleInit {
  constructor(private readonly seederService: SeederService) {}

  async onModuleInit() {
    if (envs.server.environment !== 'production') {
      await this.seederService.seedUsers();
    }
  }
}
