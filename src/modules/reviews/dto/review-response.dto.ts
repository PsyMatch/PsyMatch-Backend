import { Psychologist } from 'src/modules/psychologist/entities/psychologist.entity';

export class reviewResponseDto {
  message: string;
  reviews: Psychologist;
}
