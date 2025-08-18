import {
  IsOptional,
  IsString,
  IsNumber,
  Length,
  Min,
  Max,
  Matches,
  IsDateString,
  IsEnum,
  IsEmail,
  IsPhoneNumber,
  IsStrongPassword,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { EInsurance } from '../enums/insurances.enum';

const transformToNumber = (value: unknown): number | undefined =>
  typeof value === 'number'
    ? value
    : typeof value === 'string' && value.trim() !== ''
      ? Number(value)
      : undefined;

const cleanEmpty = (value: unknown): string | undefined =>
  value === '' ? undefined : (value as string);

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Nombre completo del usuario',
    example: '',
    minLength: 1,
  })
  @IsOptional()
  @Transform(({ value }) => cleanEmpty(value))
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Alias del usuario',
    example: '',
  })
  @Transform(({ value }) => cleanEmpty(value))
  @IsOptional()
  @IsString()
  alias?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Imagen de perfil',
  })
  @IsOptional()
  @Transform(({ value }) => cleanEmpty(value))
  @IsString({ message: 'La foto de perfil debe ser un string válido.' })
  profile_picture?: string;

  @ApiPropertyOptional({
    description:
      'Número de teléfono del usuario (formato internacional soportado)',
    example: '',
  })
  @IsOptional()
  @Transform(({ value }) => cleanEmpty(value))
  @IsPhoneNumber(undefined, {
    message: 'El teléfono debe ser un número válido.',
  })
  @Matches(/^(\+?[1-9]\d{1,14})$/, {
    message:
      'El teléfono debe ser un número válido en formato internacional (ej: +5411123456789 o 1123456789)',
  })
  @Length(8, 15, { message: 'El teléfono debe tener entre 8 y 15 dígitos.' })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Fecha de nacimiento del usuario',
    example: '',
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @Transform(({ value }) => cleanEmpty(value))
  @IsDateString(
    {},
    { message: 'La fecha de nacimiento debe ser una fecha válida.' },
  )
  birthdate?: Date;

  @ApiPropertyOptional({
    description: 'Obra social del usuario',
    example: '',
    enum: EInsurance,
  })
  @IsOptional()
  @Transform(({ value }) => cleanEmpty(value))
  @IsEnum(EInsurance, {
    message: 'La obra social debe ser una opción válida.',
  })
  health_insurance?: EInsurance;

  @ApiPropertyOptional({
    description: 'Dirección del usuario',
    example: '',
  })
  @IsOptional()
  @Transform(({ value }) => cleanEmpty(value))
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'Contacto de emergencia',
    example: '',
  })
  @IsOptional()
  @Transform(({ value }) => cleanEmpty(value))
  @IsString({ message: 'El contacto de emergencia debe ser un string.' })
  emergency_contact?: string;

  @ApiPropertyOptional({
    description: 'Correo electrónico del usuario (debe ser único)',
    example: '',
  })
  @IsOptional()
  @Transform(({ value }) => cleanEmpty(value))
  @IsEmail(
    {},
    {
      message: 'El correo electrónico debe tener un formato válido.',
    },
  )
  email?: string;

  @ApiPropertyOptional({
    description:
      'Latitud de la ubicación del usuario (debe estar entre -90 y 90)',
    example: '',
    minimum: -90,
    maximum: 90,
  })
  @IsOptional()
  @Transform(({ value }) => transformToNumber(value))
  @IsNumber({}, { message: 'La latitud debe ser un número.' })
  @Min(-90, { message: 'La latitud debe estar entre -90 y 90.' })
  @Max(90, { message: 'La latitud debe estar entre -90 y 90.' })
  latitude?: number;

  @ApiPropertyOptional({
    description:
      'Longitud de la ubicación del usuario (debe estar entre -180 y 180)',
    example: '',
    minimum: -180,
    maximum: 180,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => transformToNumber(value))
  @IsNumber({}, { message: 'La longitud debe ser un número.' })
  @Min(-180, { message: 'La longitud debe estar entre -180 y 180.' })
  @Max(180, { message: 'La longitud debe estar entre -180 y 180.' })
  longitude?: number;

  @ApiPropertyOptional({
    description:
      'Contraseña del usuario (debe contener al menos una minúscula, una mayúscula y un número; el carácter especial es opcional)',
    example: '',
    minLength: 6,
    maxLength: 100,
  })
  @IsOptional()
  @Transform(({ value }) => cleanEmpty(value))
  @IsStrongPassword({}, { message: 'La contraseña debe ser un string.' })
  @Matches(/^(?=.*\p{Lu})(?=.*\p{Ll})(?=.*\d).{6,100}$/u, {
    message:
      'La contraseña debe contener al menos una minúscula, una mayúscula y un número. El carácter especial es opcional.',
  })
  @Length(6, 100, {
    message: 'La contraseña debe tener entre 6 y 100 caracteres.',
  })
  password?: string;
}
