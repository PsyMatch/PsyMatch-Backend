import { ValidatePsychologistDto } from '../dto/validate-psychologist.dto';

export interface ValidatePsychologistAccountParams {
  createPsychologistDto: ValidatePsychologistDto;
  req: {
    user: {
      id: string;
    };
  };
}
