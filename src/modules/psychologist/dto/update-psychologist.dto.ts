import {
  IsOptional,
  IsString,
  IsNumber,
  Length,
  Min,
  Max,
  IsEnum,
  IsArray,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { EPsychologistSpecialty } from '../enums/specialities.enum';
import { ETherapyApproach } from '../enums/therapy-approaches.enum';
import { ESessionType } from '../enums/session-types.enum';
import { EModality } from '../enums/modality.enum';
import { EInsurance } from '../../users/enums/insurances.enum';
import { EAvailability } from '../enums/availability.enum';
import { ELanguage } from '../enums/languages.enum';

export class UpdatePsychologistDto {
  @ApiPropertyOptional({
    description: 'Número de licencia profesional',
    example: 12345,
  })
  @Transform(({ value }): number | undefined => {
    if (value === '' || value === null || value === undefined) {
      return undefined;
    }
    const parsed =
      typeof value === 'string' ? parseInt(value, 10) : Number(value);
    return isNaN(parsed) ? undefined : parsed;
  })
  @IsOptional()
  @IsNumber({}, { message: 'El número de licencia debe ser un número' })
  @Min(1, { message: 'El número de licencia debe ser mayor a 0' })
  license_number?: number;

  @ApiPropertyOptional({
    description:
      'Número de teléfono del usuario (formato internacional aceptado)',
    example: '+5411123456789',
  })
  @Transform(({ value }): string | undefined => {
    if (value === '' || value === null || value === undefined) {
      return undefined;
    }
    return String(value);
  })
  @IsOptional()
  @IsString({ message: 'El teléfono debe ser un string.' })
  @Matches(/^(\+?[1-9]\d{1,14})$/, {
    message:
      'El teléfono debe ser un número válido (ej., +5411123456789 o 1123456789)',
  })
  @Length(8, 15, { message: 'El teléfono debe tener entre 8 y 15 dígitos.' })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Dirección del consultorio',
    example: 'Av. Corrientes 1234, Oficina 302, Buenos Aires',
  })
  @Transform(({ value }): string | undefined => {
    if (value === '' || value === null || value === undefined) {
      return undefined;
    }
    return String(value);
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
  @Transform(({ value }): number | undefined => {
    if (value === '' || value === null || value === undefined) {
      return undefined;
    }
    const parsed =
      typeof value === 'string' ? parseInt(value, 10) : Number(value);
    return isNaN(parsed) ? undefined : parsed;
  })
  @IsOptional()
  @IsNumber({}, { message: 'Los años de experiencia deben ser un número' })
  @Min(0, { message: 'Los años de experiencia no pueden ser negativos' })
  @Max(50, { message: 'Los años de experiencia no pueden exceder 50' })
  professional_experience?: number;

  @ApiPropertyOptional({
    description: 'Especialidades profesionales',
    enum: EPsychologistSpecialty,
    isArray: true,
    example: [
      EPsychologistSpecialty.ANXIETY_DISORDER,
      EPsychologistSpecialty.DEPRESSION,
    ],
  })
  @Transform(({ value }): EPsychologistSpecialty[] | undefined => {
    if (value === '' || value === null || value === undefined) {
      return undefined;
    }
    if (typeof value === 'string') {
      return value
        .split(',')
        .map((item) => item.trim() as EPsychologistSpecialty);
    }
    return Array.isArray(value)
      ? (value as EPsychologistSpecialty[])
      : ([value] as EPsychologistSpecialty[]);
  })
  @IsOptional()
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
  @Transform(({ value }): ETherapyApproach[] | undefined => {
    if (value === '' || value === null || value === undefined) {
      return undefined;
    }
    if (typeof value === 'string') {
      return value.split(',').map((item) => item.trim() as ETherapyApproach);
    }
    return Array.isArray(value)
      ? (value as ETherapyApproach[])
      : ([value] as ETherapyApproach[]);
  })
  @IsOptional()
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
  @Transform(({ value }): ESessionType[] | undefined => {
    if (value === '' || value === null || value === undefined) {
      return undefined;
    }
    if (typeof value === 'string') {
      return value.split(',').map((item) => item.trim() as ESessionType);
    }
    return Array.isArray(value)
      ? (value as ESessionType[])
      : ([value] as ESessionType[]);
  })
  @IsOptional()
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
  @Transform(({ value }): EModality | undefined => {
    if (value === '' || value === null || value === undefined) {
      return undefined;
    }
    return value as EModality;
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
  @Transform(({ value }): EInsurance[] | undefined => {
    if (value === '' || value === null || value === undefined) {
      return undefined;
    }
    if (typeof value === 'string') {
      return value.split(',').map((item) => item.trim() as EInsurance);
    }
    return Array.isArray(value)
      ? (value as EInsurance[])
      : ([value] as EInsurance[]);
  })
  @IsOptional()
  @IsArray({ message: 'Las obras sociales aceptadas deben ser un array' })
  @IsEnum(EInsurance, {
    each: true,
    message: 'Cada obra social debe ser un proveedor válido',
  })
  insurance_accepted?: EInsurance[];

  @ApiPropertyOptional({
    description: 'Biografía profesional',
    example: 'Psicólogo clínico licenciado con más de 5 años de experiencia...',
  })
  @Transform(({ value }): string | undefined => {
    if (value === '' || value === null || value === undefined) {
      return undefined;
    }
    return String(value);
  })
  @IsOptional()
  @IsString({ message: 'La biografía debe ser un string' })
  @Length(50, 1000, {
    message: 'La biografía debe tener entre 50 y 1000 caracteres',
  })
  personal_biography?: string;

  @ApiPropertyOptional({
    description: 'Dias de disponibilidad',
    enum: EAvailability,
    isArray: true,
    example: [EAvailability.MONDAY, EAvailability.TUESDAY],
  })
  @Transform(({ value }) => {
    if (value === '' || value === null || value === undefined) {
      return undefined;
    }
    if (typeof value === 'string') {
      try {
        const parsed: unknown = JSON.parse(value);
        return Array.isArray(parsed)
          ? (parsed as EAvailability[])
          : [parsed as EAvailability];
      } catch {
        return value.split(',').map((item) => item.trim()) as EAvailability[];
      }
    }
    return Array.isArray(value)
      ? (value as EAvailability[])
      : [value as EAvailability];
  })
  @IsOptional()
  @IsArray({ message: 'La disponibilidad debe ser un array' })
  @IsEnum(EAvailability, {
    each: true,
    message: 'Cada día de disponibilidad debe ser válido',
  })
  availability?: EAvailability[];

  @ApiPropertyOptional({
    description: 'Título profesional',
    example: 'Licenciado en Psicología',
  })
  @Transform(({ value }): string | undefined => {
    if (value === '' || value === null || value === undefined) {
      return undefined;
    }
    return String(value);
  })
  @IsOptional()
  @IsString({ message: 'El título profesional debe ser un string' })
  professional_title?: string;

  @ApiPropertyOptional({
    description: 'Idiomas que maneja el psicólogo',
    enum: ELanguage,
    isArray: true,
    example: [ELanguage.SPANISH, ELanguage.ENGLISH],
  })
  @Transform(({ value }): ELanguage[] | undefined => {
    if (value === '' || value === null || value === undefined) {
      return undefined;
    }
    if (typeof value === 'string') {
      return value.split(',').map((item) => item.trim() as ELanguage);
    }
    return Array.isArray(value)
      ? (value as ELanguage[])
      : ([value] as ELanguage[]);
  })
  @IsOptional()
  @IsArray({ message: 'Los idiomas deben ser un array' })
  @IsEnum(ELanguage, {
    each: true,
    message: 'Cada idioma debe ser válido',
  })
  languages?: ELanguage[];

  @ApiPropertyOptional({
    description: 'Precio de la consulta (solo para psicólogos)',
    example: 100,
    minimum: 1,
  })
  @Transform(({ value }): number | undefined => {
    if (value === '' || value === null || value === undefined) {
      return undefined;
    }
    const parsed =
      typeof value === 'string' ? parseFloat(value) : Number(value);
    return isNaN(parsed) ? undefined : parsed;
  })
  @IsOptional()
  @IsNumber({}, { message: 'El precio de consulta debe ser un número' })
  @Min(1, { message: 'El precio de consulta debe ser mayor a 0' })
  consultation_fee?: number;
}
