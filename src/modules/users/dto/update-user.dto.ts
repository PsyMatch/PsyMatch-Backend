import {
  IsOptional,
  IsString,
  IsNumber,
  Length,
  MinLength,
  Min,
  Max,
  Matches,
  IsDateString,
  IsEnum,
  IsArray,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { EInsurance } from '../enums/insurances .enum';

const transformToDate = (value: unknown): Date | undefined => {
  if (!value) return undefined;

  if (value instanceof Date) {
    return value;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const date = new Date(value);
    return isNaN(date.getTime()) ? undefined : date;
  }

  return undefined;
};

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Nombre completo del usuario',
    example: 'Juan Carlos Pérez',
  })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser un string.' })
  @Length(1, 100, { message: 'El nombre debe tener entre 1 y 100 caracteres.' })
  name?: string;

  @ApiPropertyOptional({
    description: 'URL de la foto de perfil del usuario',
    example: 'https://example.com/profile/updated.jpg',
  })
  @IsOptional()
  @IsString({ message: 'La foto de perfil debe ser un string.' })
  profile_picture?: string;

  @ApiPropertyOptional({
    description:
      'Número de teléfono del usuario (formato internacional aceptado)',
    example: '+5411123456789',
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
    description: 'Fecha de nacimiento del usuario',
    example: '2025-07-31',
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'La fecha de nacimiento debe ser una fecha válida' },
  )
  @Transform(({ value }) => transformToDate(value))
  birthdate?: Date;

  @ApiPropertyOptional({
    description:
      'DNI del usuario (Documento Nacional de Identidad) - debe ser único',
    example: 12345678,
    minimum: 1000000,
    maximum: 99999999,
  })
  @IsOptional()
  @IsNumber({}, { message: 'El DNI debe ser un número' })
  @Min(1000000, { message: 'El DNI debe tener al menos 7 dígitos' })
  @Max(99999999, { message: 'El DNI no puede exceder 8 dígitos' })
  dni?: number;

  @ApiPropertyOptional({
    description: 'Obra social del usuario',
    example: 'osde',
    enum: EInsurance,
  })
  @IsOptional()
  @IsEnum(EInsurance, {
    message: 'La obra social debe ser un proveedor válido',
  })
  health_insurance?: EInsurance;

  @ApiPropertyOptional({
    description: 'Obras sociales aceptadas (solo para psicólogos)',
    example: ['osde', 'swiss-medical', 'ioma'],
    enum: EInsurance,
    isArray: true,
  })
  @IsOptional()
  @IsArray({ message: 'Las obras sociales aceptadas deben ser un array' })
  @IsEnum(EInsurance, {
    each: true,
    message: 'Cada obra social debe ser un proveedor válido',
  })
  insurance_accepted?: EInsurance[];

  @ApiPropertyOptional({
    description:
      'Dirección del usuario (actualizar esto también actualizará las coordenadas)',
    example: 'Av. Corrientes 1234, Buenos Aires, Argentina',
  })
  @IsOptional()
  @IsString({ message: 'La dirección debe ser un string.' })
  @Length(3, 200, {
    message: 'La dirección debe tener entre 3 y 200 caracteres.',
  })
  address?: string;

  @ApiPropertyOptional({
    description: 'Información de contacto de emergencia',
    example: 'María Pérez - +5411987654321 - Madre',
  })
  @IsOptional()
  @IsString({ message: 'El contacto de emergencia debe ser un string' })
  @Length(1, 255, {
    message: 'El contacto de emergencia debe tener entre 1 y 255 caracteres',
  })
  emergency_contact?: string;

  @ApiPropertyOptional({
    description: 'Dirección de correo electrónico del usuario (debe ser único)',
    example: 'newemail@example.com',
  })
  @IsOptional()
  @IsString({ message: 'El email debe ser un string.' })
  @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
    message: 'El email debe ser una dirección de correo válida',
  })
  email?: string;

  @ApiPropertyOptional({
    description:
      'Latitud de la ubicación del usuario (se actualiza cuando cambia la dirección)',
    example: -34.6037,
    minimum: -90,
    maximum: 90,
  })
  @IsOptional()
  @IsNumber({}, { message: 'La latitud debe ser un número.' })
  @Min(-90, { message: 'La latitud debe estar entre -90 y 90.' })
  @Max(90, { message: 'La latitud debe estar entre -90 y 90.' })
  latitude?: number;

  @ApiPropertyOptional({
    description:
      'Longitud de la ubicación del usuario (se actualiza cuando cambia la dirección)',
    example: -58.3816,
    minimum: -180,
    maximum: 180,
  })
  @IsOptional()
  @IsNumber({}, { message: 'La longitud debe ser un número.' })
  @Min(-180, { message: 'La longitud debe estar entre -180 y 180.' })
  @Max(180, { message: 'La longitud debe estar entre -180 y 180.' })
  longitude?: number;

  @ApiPropertyOptional({
    description:
      'Contraseña del usuario (debe contener al menos una letra minúscula, una mayúscula, un número y un carácter especial)',
    example: 'NewSecurePass123!',
    minLength: 8,
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'La contraseña debe ser un string.' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  @Length(8, 100, {
    message: 'La contraseña debe tener entre 8 y 100 caracteres.',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/, {
    message:
      'La contraseña debe contener al menos una letra minúscula, una mayúscula, un número y un carácter especial',
  })
  password?: string;
}
