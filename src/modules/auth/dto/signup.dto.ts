import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Length,
  Validate,
  IsNumber,
  Min,
  Max,
  IsPositive,
  IsInt,
  IsDateString,
  IsEnum,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { MatchPasswordHelper } from '../../utils/helpers/matchPassword.helper';
import { EInsurance } from '../../users/enums/insurances.enum';

const transformToNumber = (value: unknown): number | undefined =>
  typeof value === 'number'
    ? value
    : typeof value === 'string' && value.trim() !== ''
      ? Number(value)
      : undefined;

const cleanEmpty = (value: unknown): string | undefined =>
  value === '' ? undefined : (value as string);

export class SignUpDto {
  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Carlos Pérez',
    minLength: 1,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'URL de la foto de perfil del usuario',
    example: 'https://example.com/profile/juan-perez.jpg',
  })
  @IsString()
  profile_picture: string;

  @ApiProperty({
    description:
      'Número de teléfono del usuario (formato internacional soportado)',
    example: '+5411123456789',
  })
  @IsString({ message: 'El teléfono debe ser un string.' })
  @Matches(/^(\+?[1-9]\d{1,14})$/, {
    message:
      'El teléfono debe ser un número válido en formato internacional (ej: +5411123456789 o 1123456789)',
  })
  @Length(8, 15, { message: 'El teléfono debe tener entre 8 y 15 dígitos.' })
  phone: string;

  @ApiProperty({
    description: 'Fecha de nacimiento del usuario',
    example: '2001-05-01',
    type: 'string',
    format: 'date',
  })
  @IsDateString(
    {},
    { message: 'La fecha de nacimiento debe ser una fecha válida.' },
  )
  birthdate: Date;

  @ApiProperty({
    description:
      'DNI del usuario (Documento Nacional de Identidad) - debe ser único',
    example: 12345678,
    minimum: 1000000,
    maximum: 99999999,
  })
  @Transform(({ value }) => transformToNumber(value))
  @IsNumber({}, { message: 'El DNI debe ser un número.' })
  @IsInt({ message: 'El DNI debe ser un número entero.' })
  @IsPositive({ message: 'El DNI debe ser un número positivo.' })
  @Min(1000000, { message: 'El DNI debe tener al menos 7 dígitos.' })
  @Max(99999999, { message: 'El DNI no debe exceder los 8 dígitos.' })
  dni: number;

  @ApiProperty({
    description: 'Obra social del usuario',
    example: 'osde',
    enum: EInsurance,
  })
  @Transform(({ value }) => cleanEmpty(value))
  @IsOptional()
  @IsEnum(EInsurance, {
    message: 'La obra social debe ser una opción válida.',
  })
  health_insurance?: EInsurance;

  @ApiProperty({
    description: 'Dirección del usuario',
    example: 'Av. Corrientes 1234, Buenos Aires, Argentina',
  })
  @IsString()
  address: string;

  @ApiProperty({
    description: 'Contacto de emergencia',
    example: 'María Pérez - +5411987654321 - Madre',
  })
  @Transform(({ value }) => cleanEmpty(value))
  @IsOptional()
  @IsString({ message: 'El contacto de emergencia debe ser un string.' })
  @MaxLength(255, {
    message: 'El contacto de emergencia debe tener entre 1 y 255 caracteres.',
  })
  emergency_contact?: string;

  @ApiProperty({
    description:
      'Latitud de la ubicación del usuario (debe estar entre -90 y 90)',
    example: -34.6037,
    minimum: -90,
    maximum: 90,
  })
  @IsOptional()
  @Transform(({ value }) => transformToNumber(value))
  @IsNumber({}, { message: 'La latitud debe ser un número.' })
  @Min(-90, { message: 'La latitud debe estar entre -90 y 90.' })
  @Max(90, { message: 'La latitud debe estar entre -90 y 90.' })
  latitude?: number;

  @ApiProperty({
    description:
      'Longitud de la ubicación del usuario (debe estar entre -180 y 180)',
    example: -58.3816,
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

  @ApiProperty({
    description: 'Correo electrónico del usuario (debe ser único)',
    example: 'juan.perez@email.com',
  })
  @IsNotEmpty()
  @IsEmail(
    {},
    { message: 'El correo electrónico debe tener un formato válido.' },
  )
  email: string;

  @ApiProperty({
    description:
      'Contraseña del usuario (debe contener al menos una minúscula, una mayúscula, un número y un carácter especial)',
    example: 'SecurePass123!',
    minLength: 8,
    maxLength: 100,
  })
  @IsString({ message: 'La contraseña debe ser un string.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/, {
    message:
      'La contraseña debe contener al menos una minúscula, una mayúscula, un número y un carácter especial.',
  })
  @Length(8, 100, {
    message: 'La contraseña debe tener entre 8 y 100 caracteres.',
  })
  password: string;

  @ApiProperty({
    description:
      'Confirmación de contraseña (debe coincidir con la contraseña)',
    example: 'SecurePass123!',
  })
  @Validate(MatchPasswordHelper, ['password'])
  confirmPassword: string;
}
