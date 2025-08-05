import { Module } from '@nestjs/common';
import { PsychologistService } from './psychologist.service';
import { PsychologistController } from './psychologist.controller';

@Module({
  controllers: [PsychologistController],
  providers: [PsychologistService],
})
export class PsychologistModule {}
