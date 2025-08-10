import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { EPsychologistSpecialty } from '../enums/specialities.enum';

export class ValidatePsychologistDto {
  @IsOptional()
  @IsString({ message: 'Office address must be a string' })
  @MaxLength(255, {
    message: 'Office address must be less than 255 characters',
  })
  office_address?: string;

  @IsString({ message: 'License number must be a string' })
  @IsNotEmpty({ message: 'License number is required' })
  @MaxLength(50, {
    message: 'License number must be less than 50 characters',
  })
  license_number: string;

  @IsArray({ message: 'Specialities must be an array' })
  @ArrayNotEmpty({ message: 'At least one speciality is required' })
  @IsEnum(EPsychologistSpecialty, {
    each: true,
    message: 'Each speciality must be a valid EPsychologistSpecialty',
  })
  specialities: EPsychologistSpecialty[];
}
