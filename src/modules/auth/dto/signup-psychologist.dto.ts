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
import { EInsurance } from '../../users/enums/insurance_accepted .enum';
import { ETherapyApproach } from '../../psychologist/enums/therapy-approaches.enum';
import { ESessionType } from '../../psychologist/enums/session-types.enum';
import { EModality } from '../../psychologist/enums/modality.enum';
import { ELanguages } from '../../psychologist/enums/languages.enum';
import { EAvailability } from '../../psychologist/enums/availability.enum';

const transformToNumber = (value: unknown): number | undefined => {
  if (typeof value === 'string' && value.trim() !== '') {
    const num = Number(value);
    return isNaN(num) ? undefined : num;
  }
  return typeof value === 'number' ? value : undefined;
};

export class SignUpPsychologistDto {
  @ApiProperty({
    description: 'Full name of the psychologist',
    example: 'Dr. Ana García',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'DNI (National Identity Document)',
    example: 87654321,
    minimum: 1000000,
    maximum: 99999999,
  })
  @IsNotEmpty({ message: 'DNI is required' })
  @Transform(({ value }: { value: unknown }) => transformToNumber(value))
  @IsNumber({}, { message: 'DNI must be a number' })
  @IsInt({ message: 'DNI must be an integer' })
  @IsPositive({ message: 'DNI must be a positive number' })
  dni: number;

  @ApiPropertyOptional({
    description: 'User birthdate',
    example: '2001-05-01',
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Birthdate must be a valid date' })
  birthdate?: Date;

  @ApiProperty({
    description: 'Email address (must be unique)',
    example: 'ana.garcia@psychologist.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Password with security requirements',
    example: 'SecurePass123!',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Password confirmation (must match password)',
    example: 'SecurePass123!',
  })
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;

  @ApiProperty({
    description: 'Phone number',
    example: '+5411777888999',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message:
      'Phone must be a valid international phone number (e.g., +5411123456789 or 1123456789)',
  })
  phone?: string;

  @ApiProperty({
    description: 'Latitude coordinate',
    example: -34.6037,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    value && typeof value === 'string' ? parseFloat(value) : undefined,
  )
  latitude?: number;

  @ApiProperty({
    description: 'Longitude coordinate',
    example: -58.3816,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    value && typeof value === 'string' ? parseFloat(value) : undefined,
  )
  longitude?: number;

  @ApiPropertyOptional({
    description: 'Office address for consultations',
    example: 'Consultorio en Av. Callao 1000, Piso 5',
  })
  @IsOptional()
  @IsString()
  office_address?: string;

  @ApiProperty({
    description: 'License number (6 digits)',
    example: 123456,
    minimum: 100000,
    maximum: 999999,
  })
  @Transform(({ value }: { value: unknown }) => transformToNumber(value))
  @IsNotEmpty({ message: 'License number is required' })
  @IsNumber({}, { message: 'License number must be a number' })
  @IsInt({ message: 'License number must be an integer' })
  @IsPositive({ message: 'License number must be a positive number' })
  license_number: number;

  @ApiPropertyOptional({
    description: 'Optional profile picture URL',
    example: 'https://example.com/profile.jpg',
  })
  @IsOptional()
  @IsString()
  profile_picture?: string;

  @ApiPropertyOptional({
    description: 'Personal biography',
    example:
      'Psychologist specialized in cognitive behavioral therapy with 10 years of experience.',
  })
  @IsOptional()
  @IsString()
  personal_biography?: string;

  @ApiPropertyOptional({
    description: 'Years of professional experience',
    example: 5,
    minimum: 0,
    maximum: 50,
  })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => transformToNumber(value))
  @IsNumber({}, { message: 'Professional experience must be a number' })
  @IsInt({ message: 'Professional experience must be an integer' })
  professional_experience?: number;

  @ApiPropertyOptional({
    description: 'Languages spoken',
    example: ['spanish', 'english'],
    enum: ELanguages,
    isArray: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((item) => item.trim());
    }
    return Array.isArray(value)
      ? (value as ELanguages[])
      : ([value] as ELanguages[]);
  })
  @IsArray()
  @IsEnum(ELanguages, { each: true })
  languages?: ELanguages[];

  @ApiPropertyOptional({
    description: 'Therapy approaches used',
    example: ['cognitive_behavioral_therapy', 'psychodynamic_therapy'],
    enum: ETherapyApproach,
    isArray: true,
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
    example: ['individual', 'couple'],
    enum: ESessionType,
    isArray: true,
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
    description: 'Consultation modality',
    example: 'in_person',
    enum: EModality,
  })
  @IsOptional()
  @IsEnum(EModality)
  modality?: EModality;

  @ApiProperty({
    description: 'Array of specialties',
    example: ['anxiety_disorder', 'depression'],
    enum: EPsychologistSpecialty,
    isArray: true,
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((item) => item.trim());
    }
    return Array.isArray(value)
      ? (value as EPsychologistSpecialty[])
      : ([value] as EPsychologistSpecialty[]);
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(EPsychologistSpecialty, { each: true })
  specialities: EPsychologistSpecialty[];

  @ApiProperty({
    description: 'Array of insurance providers accepted',
    example: ['osde', 'swiss-medical', 'ioma'],
    enum: EInsurance,
    isArray: true,
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((item) => item.trim());
    }
    return Array.isArray(value)
      ? (value as EInsurance[])
      : ([value] as EInsurance[]);
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(EInsurance, { each: true })
  insurance_accepted: EInsurance[];

  @ApiProperty({
    description: 'Array of available days for appointments',
    example: ['monday', 'wednesday', 'friday'],
    enum: EAvailability,
    isArray: true,
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((item) => item.trim());
    }
    return Array.isArray(value)
      ? (value as EAvailability[])
      : ([value] as EAvailability[]);
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(EAvailability, { each: true })
  availability: EAvailability[];
}
