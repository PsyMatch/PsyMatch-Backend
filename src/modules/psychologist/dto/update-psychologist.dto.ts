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
import { EInsurance } from '../../users/enums/insurances .enum';

export class UpdatePsychologistDto {
  @ApiPropertyOptional({
    description: 'Número de licencia profesional',
    example: 'PSI-12345-BA',
  })
  @IsOptional()
  @IsString({ message: 'El número de licencia debe ser un string' })
  @Length(5, 50, {
    message: 'El número de licencia debe tener entre 5 y 50 caracteres',
  })
  license_number?: string;

  @ApiPropertyOptional({
    description: 'Dirección del consultorio',
    example: 'Av. Corrientes 1234, Oficina 302, Buenos Aires',
  })
  @IsOptional()
  @IsString({ message: 'La dirección del consultorio debe ser un string' })
  @Length(10, 200, {
    message:
      'La dirección del consultorio debe tener entre 10 y 200 caracteres',
  })
  office_address?: string;

  @ApiPropertyOptional({
    description: 'Años de experiencia profesional',
    example: 5,
    minimum: 0,
    maximum: 50,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Los años de experiencia deben ser un número' })
  @Min(0, { message: 'Los años de experiencia no pueden ser negativos' })
  @Max(50, { message: 'Los años de experiencia no pueden exceder 50' })
  experience_years?: number;

  @ApiPropertyOptional({
    description: 'Especialidades profesionales',
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
  @IsArray({ message: 'Las especialidades deben ser un array' })
  @IsEnum(EPsychologistSpecialty, {
    each: true,
    message: 'Cada especialidad debe ser válida',
  })
  specialities?: EPsychologistSpecialty[];

  @ApiPropertyOptional({
    description: 'Enfoques terapéuticos',
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
  @IsArray({ message: 'Los enfoques terapéuticos deben ser un array' })
  @IsEnum(ETherapyApproach, {
    each: true,
    message: 'Cada enfoque terapéutico debe ser válido',
  })
  therapy_approaches?: ETherapyApproach[];

  @ApiPropertyOptional({
    description: 'Tipos de sesión ofrecidos',
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
  @IsArray({ message: 'Los tipos de sesión deben ser un array' })
  @IsEnum(ESessionType, {
    each: true,
    message: 'Cada tipo de sesión debe ser válido',
  })
  session_types?: ESessionType[];

  @ApiPropertyOptional({
    description: 'Modalidad de terapia',
    enum: EModality,
    example: EModality.ONLINE,
  })
  @IsOptional()
  @IsEnum(EModality, { message: 'La modalidad debe ser una opción válida' })
  modality?: EModality;

  @ApiPropertyOptional({
    description: 'Obras sociales aceptadas',
    enum: EInsurance,
    isArray: true,
    example: [EInsurance.OSDE, EInsurance.SWISS_MEDICAL],
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
  @IsArray({ message: 'Las obras sociales aceptadas deben ser un array' })
  @IsEnum(EInsurance, {
    each: true,
    message: 'Cada obra social debe ser un proveedor válido',
  })
  insurance_accepted?: EInsurance[];

  @ApiPropertyOptional({
    description: 'Tarifa por sesión en USD',
    example: 80.0,
    minimum: 10,
    maximum: 500,
  })
  @IsOptional()
  @IsNumber({}, { message: 'La tarifa por sesión debe ser un número' })
  @Min(10, { message: 'La tarifa por sesión debe ser de al menos $10' })
  @Max(500, { message: 'La tarifa por sesión no puede exceder $500' })
  rate_per_session?: number;

  @ApiPropertyOptional({
    description: 'Biografía profesional',
    example: 'Psicólogo clínico licenciado con más de 5 años de experiencia...',
  })
  @IsOptional()
  @IsString({ message: 'La biografía debe ser un string' })
  @Length(50, 1000, {
    message: 'La biografía debe tener entre 50 y 1000 caracteres',
  })
  bio?: string;

  @ApiPropertyOptional({
    description: 'Horarios de disponibilidad (formato JSON)',
    example: '{"lunes": ["09:00-12:00", "14:00-18:00"]}',
  })
  @IsOptional()
  @IsString({ message: 'La disponibilidad debe ser un string' })
  availability?: string;
}
