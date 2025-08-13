import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsEnum,
  IsArray,
  ArrayNotEmpty,
  Matches,
  IsNumber,
  IsInt,
  IsPositive,
  IsDateString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EPsychologistSpecialty } from '../../psychologist/enums/specialities.enum';
import { EInsurance } from '../../users/enums/insurances.enum';
import { ETherapyApproach } from '../../psychologist/enums/therapy-approaches.enum';
import { ESessionType } from '../../psychologist/enums/session-types.enum';
import { EModality } from '../../psychologist/enums/modality.enum';
import { ELanguage } from '../../psychologist/enums/languages.enum';
import { EAvailability } from '../../psychologist/enums/availability.enum';

const transformToNumber = (value: unknown): number | undefined =>
  typeof value === 'number'
    ? value
    : typeof value === 'string' && value.trim() !== ''
      ? Number(value)
      : undefined;

const transformToArray = (value: unknown): string[] =>
  typeof value === 'string'
    ? value
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item !== '')
    : Array.isArray(value)
      ? (value as string[])
      : [];

export class SignUpPsychologistDto {
  @ApiProperty({
    description: 'Nombre completo del psicólogo',
    example: 'Dr. Ana García',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'DNI (Documento Nacional de Identidad)',
    example: 87654321,
    minimum: 1000000,
    maximum: 99999999,
  })
  @IsNotEmpty({ message: 'El DNI es obligatorio.' })
  @Transform(({ value }) => transformToNumber(value))
  @IsNumber({}, { message: 'El DNI debe ser un número.' })
  @IsInt({ message: 'El DNI debe ser un número entero.' })
  @IsPositive({ message: 'El DNI debe ser un número positivo.' })
  dni: number;

  @ApiPropertyOptional({
    description: 'Fecha de nacimiento',
    example: '2001-05-01',
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'La fecha de nacimiento debe ser una fecha válida.' },
  )
  birthdate?: Date;

  @ApiProperty({
    description: 'Correo electrónico (debe ser único)',
    example: 'ana.garcia@psychologist.com',
  })
  @IsEmail(
    {},
    { message: 'El correo electrónico debe tener un formato válido.' },
  )
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
  email: string;

  @ApiProperty({
    description: 'Contraseña con requisitos de seguridad',
    example: 'SecurePass123!',
  })
  @IsString({ message: 'La contraseña debe ser un string.' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
  password: string;

  @ApiProperty({
    description:
      'Confirmación de contraseña (debe coincidir con la contraseña)',
    example: 'SecurePass123!',
  })
  @IsString({ message: 'La confirmación de contraseña debe ser un string.' })
  @IsNotEmpty({ message: 'La confirmación de contraseña es obligatoria.' })
  confirmPassword: string;

  @ApiProperty({
    description: 'Número de teléfono',
    example: '+5411777888999',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El teléfono debe ser un string.' })
  @Matches(/^(\+?[1-9]\d{1,14})$/, {
    message:
      'El teléfono debe ser un número válido en formato internacional (ej: +5411123456789 o 1123456789)',
  })
  phone?: string;

  @ApiProperty({
    description: 'Coordenada de latitud',
    example: -34.6037,
    required: false,
  })
  @Transform(({ value }) => transformToNumber(value))
  @IsOptional()
  latitude?: number;

  @ApiProperty({
    description: 'Coordenada de longitud',
    example: -58.3816,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => transformToNumber(value))
  longitude?: number;

  @ApiPropertyOptional({
    description: 'Dirección del consultorio para consultas',
    example: 'Consultorio en Av. Callao 1000, Piso 5',
  })
  @IsOptional()
  @IsString()
  office_address?: string;

  @ApiProperty({
    description: 'Número de matrícula profesional (6 dígitos)',
    example: 123456,
    minimum: 100000,
    maximum: 999999,
  })
  @Transform(({ value }) => transformToNumber(value))
  @IsNotEmpty({ message: 'El número de matrícula es obligatorio.' })
  @IsNumber({}, { message: 'El número de matrícula debe ser un número.' })
  @IsInt({ message: 'El número de matrícula debe ser un número entero.' })
  @IsPositive({
    message: 'El número de matrícula debe ser un número positivo.',
  })
  license_number: number;

  @ApiPropertyOptional({
    description: 'URL opcional de la foto de perfil',
    example: 'https://example.com/profile.jpg',
  })
  @IsOptional()
  @IsString({ message: 'La URL de la foto de perfil debe ser un string.' })
  profile_picture?: string;

  @ApiPropertyOptional({
    description: 'Biografía personal',
    example:
      'Psicólogo especializado en terapia cognitivo conductual con 10 años de experiencia.',
  })
  @IsOptional()
  @IsString({ message: 'La biografía personal debe ser un string.' })
  personal_biography?: string;

  @ApiPropertyOptional({
    description: 'Años de experiencia profesional',
    example: 5,
    minimum: 0,
    maximum: 50,
  })
  @IsOptional()
  @Transform(({ value }) => transformToNumber(value))
  @IsNumber(
    {},
    { message: 'Los años de experiencia profesional deben ser un número.' },
  )
  @IsInt({
    message: 'Los años de experiencia profesional deben ser un número entero.',
  })
  professional_experience?: number;

  @ApiPropertyOptional({
    description: 'Idiomas hablados',
    example: ['spanish', 'english'],
    enum: ELanguage,
    isArray: true,
  })
  @IsOptional()
  @Transform(({ value }) => transformToArray(value))
  @IsArray()
  @IsEnum(ELanguage, { each: true })
  languages?: ELanguage[];

  @ApiPropertyOptional({
    description: 'Enfoques terapéuticos utilizados',
    example: ['cognitive_behavioral_therapy', 'psychodynamic_therapy'],
    enum: ETherapyApproach,
    isArray: true,
  })
  @IsOptional()
  @Transform(({ value }) => transformToArray(value))
  @IsArray()
  @IsEnum(ETherapyApproach, { each: true })
  therapy_approaches?: ETherapyApproach[];

  @ApiPropertyOptional({
    description: 'Tipos de sesión ofrecidos',
    example: ['individual', 'couple'],
    enum: ESessionType,
    isArray: true,
  })
  @IsOptional()
  @Transform(({ value }) => transformToArray(value))
  @IsArray()
  @IsEnum(ESessionType, { each: true })
  session_types?: ESessionType[];

  @ApiPropertyOptional({
    description: 'Modalidad de consulta',
    example: 'in_person',
    enum: EModality,
  })
  @IsOptional()
  @IsEnum(EModality)
  modality?: EModality;

  @ApiProperty({
    description: 'Lista de especialidades profesionales',
    example: ['anxiety_disorder', 'depression'],
    enum: EPsychologistSpecialty,
    isArray: true,
  })
  @Transform(({ value }) => transformToArray(value))
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(EPsychologistSpecialty, { each: true })
  specialities: EPsychologistSpecialty[];

  @ApiProperty({
    description: 'Lista de obras sociales aceptadas',
    example: ['osde', 'swiss-medical', 'ioma'],
    enum: EInsurance,
    isArray: true,
  })
  @Transform(({ value }) => transformToArray(value))
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(EInsurance, { each: true })
  insurance_accepted: EInsurance[];

  @ApiProperty({
    description: 'Días disponibles para turnos',
    example: ['monday', 'wednesday', 'friday'],
    enum: EAvailability,
    isArray: true,
  })
  @Transform(({ value }) => transformToArray(value))
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(EAvailability, { each: true })
  availability: EAvailability[];
}
