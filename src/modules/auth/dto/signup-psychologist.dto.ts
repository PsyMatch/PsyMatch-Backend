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
  Validate,
  Length,
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
import { MatchPasswordHelper } from '../../utils/helpers/matchPassword.helper';

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
    example: 'Pablo Suárez',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'DNI (Documento Nacional de Identidad)',
    example: 34567890,
    minimum: 1000000,
    maximum: 99999999,
  })
  @IsNotEmpty({ message: 'El DNI es obligatorio.' })
  @Transform(({ value }) => transformToNumber(value))
  @IsNumber({}, { message: 'El DNI debe ser un número.' })
  @IsInt({ message: 'El DNI debe ser un número entero.' })
  @IsPositive({ message: 'El DNI debe ser un número positivo.' })
  dni: number;

  @ApiProperty({
    description: 'Fecha de nacimiento',
    example: '1982-09-15',
    type: 'string',
    format: 'date',
  })
  @IsDateString(
    {},
    { message: 'La fecha de nacimiento debe ser una fecha válida.' },
  )
  birthdate: Date;

  @ApiProperty({
    description: 'Correo electrónico (debe ser único)',
    example: 'pablo.suarez@psychologist.com',
  })
  @IsEmail(
    {},
    { message: 'El correo electrónico debe tener un formato válido.' },
  )
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
  email: string;

  @ApiProperty({
    description:
      'Contraseña del usuario (debe contener al menos una minúscula, una mayúscula y un número; el carácter especial es opcional)',
    example: 'PabloPass789!',
    minLength: 6,
    maxLength: 100,
  })
  @IsString({ message: 'La contraseña debe ser un string.' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
  @Matches(/^(?=.*\p{Lu})(?=.*\p{Ll})(?=.*\d).{6,100}$/u, {
    message:
      'La contraseña debe contener al menos una minúscula, una mayúscula y un número. El carácter especial es opcional.',
  })
  @Length(6, 100, {
    message: 'La contraseña debe tener entre 6 y 100 caracteres.',
  })
  password: string;

  @ApiProperty({
    description:
      'Confirmación de contraseña (debe coincidir con la contraseña)',
    example: 'PabloPass789!',
  })
  @Validate(MatchPasswordHelper, ['password'])
  confirmPassword: string;

  @ApiProperty({
    description: 'Número de teléfono',
    example: '+5491166554433',
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
    example: -33.1234,
    required: false,
  })
  @Transform(({ value }) => transformToNumber(value))
  @IsOptional()
  latitude?: number;

  @ApiProperty({
    description: 'Coordenada de longitud',
    example: -61.4321,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => transformToNumber(value))
  longitude?: number;

  @ApiPropertyOptional({
    description: 'Dirección del consultorio para consultas',
    example: 'Consultorio en Calle Sarmiento 200, Piso 2',
  })
  @IsOptional()
  @IsString()
  office_address?: string;

  @ApiProperty({
    description: 'Número de matrícula profesional (6 dígitos)',
    example: 324165,
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

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
    description: 'Imagen de perfil (obligatoria)',
    example: 'https://example.com/profile/pablo-suarez.jpg',
  })
  @IsOptional()
  profile_picture?: string;

  @ApiProperty({
    description: 'Biografía personal',
    example:
      'Psicólogo especializado en terapia cognitivo conductual con 10 años de experiencia.',
  })
  @IsString({ message: 'La biografía personal debe ser un string.' })
  @IsNotEmpty({ message: 'La biografía personal es obligatoria.' })
  personal_biography: string;

  @ApiProperty({
    description: 'Título profesional del psicólogo',
    example: 'Licenciado en Psicología',
  })
  @IsString({ message: 'El título profesional debe ser un string.' })
  @IsNotEmpty({ message: 'El título profesional es obligatorio.' })
  professional_title: string;

  @ApiProperty({
    description: 'Años de experiencia profesional',
    example: 5,
    minimum: 0,
    maximum: 50,
  })
  @Transform(({ value }) => transformToNumber(value))
  @IsNumber(
    {},
    { message: 'Los años de experiencia profesional deben ser un número.' },
  )
  @IsInt({
    message: 'Los años de experiencia profesional deben ser un número entero.',
  })
  @IsNotEmpty({
    message: 'Los años de experiencia profesional son obligatorios.',
  })
  professional_experience: number;

  @ApiProperty({
    description: 'Idiomas hablados',
    example: [ELanguage.SPANISH, ELanguage.ENGLISH],
    enum: ELanguage,
    isArray: true,
  })
  @Transform(({ value }) => transformToArray(value))
  @IsArray()
  @ArrayNotEmpty({ message: 'Debe especificar al menos un idioma.' })
  @IsEnum(ELanguage, { each: true })
  languages: ELanguage[];

  @ApiProperty({
    description: 'Enfoques terapéuticos utilizados',
    example: [
      ETherapyApproach.COGNITIVE_BEHAVIORAL_THERAPY,
      ETherapyApproach.PSYCHODYNAMIC_THERAPY,
    ],
    enum: ETherapyApproach,
    isArray: true,
  })
  @Transform(({ value }) => transformToArray(value))
  @IsArray()
  @ArrayNotEmpty({
    message: 'Debe especificar al menos un enfoque terapéutico.',
  })
  @IsEnum(ETherapyApproach, { each: true })
  therapy_approaches: ETherapyApproach[];

  @ApiProperty({
    description: 'Tipos de sesión ofrecidos',
    example: [ESessionType.INDIVIDUAL, ESessionType.COUPLE],
    enum: ESessionType,
    isArray: true,
  })
  @Transform(({ value }) => transformToArray(value))
  @IsArray()
  @ArrayNotEmpty({ message: 'Debe especificar al menos un tipo de sesión.' })
  @IsEnum(ESessionType, { each: true })
  session_types: ESessionType[];

  @ApiProperty({
    description: 'Modalidad de consulta',
    example: EModality.IN_PERSON,
    enum: EModality,
  })
  @IsEnum(EModality)
  modality: EModality;

  @ApiProperty({
    description: 'Lista de especialidades profesionales',
    example: [
      EPsychologistSpecialty.ANXIETY_DISORDER,
      EPsychologistSpecialty.DEPRESSION,
    ],
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
    example: [EInsurance.OSDE, EInsurance.SWISS_MEDICAL, EInsurance.IOMA],
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
    example: [
      EAvailability.MONDAY,
      EAvailability.WEDNESDAY,
      EAvailability.FRIDAY,
    ],
    enum: EAvailability,
    isArray: true,
  })
  @Transform(({ value }) => transformToArray(value))
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(EAvailability, { each: true })
  availability: EAvailability[];

  @ApiProperty({
    description: 'Precio de la consulta (solo para psicólogos)',
    example: 100,
  })
  @Transform(({ value }) => transformToNumber(value))
  @IsNumber({}, { message: 'El precio de la consulta debe ser un número.' })
  @IsNotEmpty({ message: 'El precio de la consulta es obligatorio.' })
  consultation_fee: number;
}
