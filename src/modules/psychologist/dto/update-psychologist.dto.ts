import {
  IsOptional,
  IsString,
  IsNumber,
  Length,
  Min,
  Max,
  IsEnum,
  IsArray,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { EPsychologistSpecialty } from '../enums/specialities.enum';
import { ETherapyApproach } from '../enums/therapy-approaches.enum';
import { ESessionType } from '../enums/session-types.enum';
import { EModality } from '../enums/modality.enum';
import { EInsurance } from '../../users/enums/insurance_accepted .enum';

export class UpdatePsychologistDto {
  @ApiPropertyOptional({
    description: 'Professional license number',
    example: 'PSI-12345-BA',
  })
  @IsOptional()
  @IsString({ message: 'License number must be a string' })
  @Length(5, 50, {
    message: 'License number must be between 5 and 50 characters',
  })
  license_number?: string;

  @ApiPropertyOptional({
    description: 'Office address',
    example: 'Av. Corrientes 1234, Oficina 302, Buenos Aires',
  })
  @IsOptional()
  @IsString({ message: 'Office address must be a string' })
  @Length(10, 200, {
    message: 'Office address must be between 10 and 200 characters',
  })
  office_address?: string;

  @ApiPropertyOptional({
    description: 'Years of professional experience',
    example: 5,
    minimum: 0,
    maximum: 50,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Experience years must be a number' })
  @Min(0, { message: 'Experience years cannot be negative' })
  @Max(50, { message: 'Experience years cannot exceed 50' })
  experience_years?: number;

  @ApiPropertyOptional({
    description: 'Professional specialties',
    enum: EPsychologistSpecialty,
    isArray: true,
    example: [
      EPsychologistSpecialty.ANXIETY_DISORDER,
      EPsychologistSpecialty.DEPRESSION,
    ],
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((item) => item.trim());
    }
    return Array.isArray(value)
      ? (value as EPsychologistSpecialty[])
      : ([value] as EPsychologistSpecialty[]);
  })
  @IsArray()
  @IsEnum(EPsychologistSpecialty, { each: true })
  specialities?: EPsychologistSpecialty[];

  @ApiPropertyOptional({
    description: 'Therapy approaches',
    enum: ETherapyApproach,
    isArray: true,
    example: [ETherapyApproach.COGNITIVE_BEHAVIORAL_THERAPY],
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((item) => item.trim());
    }
    return Array.isArray(value)
      ? (value as ETherapyApproach[])
      : ([value] as ETherapyApproach[]);
  })
  @IsArray()
  @IsEnum(ETherapyApproach, { each: true })
  therapy_approaches?: ETherapyApproach[];

  @ApiPropertyOptional({
    description: 'Session types offered',
    enum: ESessionType,
    isArray: true,
    example: [ESessionType.INDIVIDUAL],
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((item) => item.trim());
    }
    return Array.isArray(value)
      ? (value as ESessionType[])
      : ([value] as ESessionType[]);
  })
  @IsArray()
  @IsEnum(ESessionType, { each: true })
  session_types?: ESessionType[];

  @ApiPropertyOptional({
    description: 'Therapy modality',
    enum: EModality,
    example: EModality.ONLINE,
  })
  @IsOptional()
  @IsEnum(EModality, { message: 'Modality must be a valid option' })
  modality?: EModality;

  @ApiPropertyOptional({
    description: 'Insurance providers accepted',
    enum: EInsurance,
    isArray: true,
    example: [EInsurance.OSDE, EInsurance.SWISSMEDICAL],
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((item) => item.trim());
    }
    return Array.isArray(value)
      ? (value as EInsurance[])
      : ([value] as EInsurance[]);
  })
  @IsArray()
  @IsEnum(EInsurance, {
    each: true,
    message: 'Each insurance must be a valid provider',
  })
  insurance_accepted?: EInsurance[];

  @ApiPropertyOptional({
    description: 'Rate per session in USD',
    example: 80.0,
    minimum: 10,
    maximum: 500,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Rate per session must be a number' })
  @Min(10, { message: 'Rate per session must be at least $10' })
  @Max(500, { message: 'Rate per session cannot exceed $500' })
  rate_per_session?: number;

  @ApiPropertyOptional({
    description: 'Professional biography',
    example: 'Licensed clinical psychologist with 5+ years of experience...',
  })
  @IsOptional()
  @IsString({ message: 'Bio must be a string' })
  @Length(50, 1000, {
    message: 'Bio must be between 50 and 1000 characters',
  })
  bio?: string;

  @ApiPropertyOptional({
    description: 'Availability schedule (JSON format)',
    example: '{"monday": ["09:00-12:00", "14:00-18:00"]}',
  })
  @IsOptional()
  @IsString({ message: 'Availability must be a string' })
  availability?: string;
}
