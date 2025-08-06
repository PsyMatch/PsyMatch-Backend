import { PartialType } from '@nestjs/swagger';
import { CreatePsychologistDto } from './validate-psychologist.dto';

export class UpdatePsychologistDto extends PartialType(CreatePsychologistDto) {}
