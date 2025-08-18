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
  IsPhoneNumber,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
    example: 'Esteban Ramírez',
    minLength: 1,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Alias del usuario',
    example: 'estebitox',
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
    example: 'https://example.com/profile/esteban-ramirez.jpg',
  })
  @Transform(({ value }) => cleanEmpty(value))
  @IsOptional()
  @IsString({ message: 'La foto de perfil debe ser un string válido.' })
  profile_picture?: string;

  @ApiProperty({
    description:
      'Número de teléfono del usuario (formato internacional soportado)',
    example: '+5491122334455',
  })
  @IsPhoneNumber(undefined, {
    message: 'El teléfono debe ser un número válido.',
  })
  @Length(8, 15, { message: 'El teléfono debe tener entre 8 y 15 dígitos.' })
  phone: string;

  @ApiProperty({
    description: 'Fecha de nacimiento del usuario',
    example: '1998-03-22',
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
    example: 23456789,
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

  @ApiPropertyOptional({
    description: 'Obra social del usuario',
    example: EInsurance.OSDE,
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
    example: 'Calle 25 de Mayo 456, Rosario, Argentina',
  })
  @IsString()
  address: string;

  @ApiPropertyOptional({
    description: 'Contacto de emergencia',
    example: 'Pedro Ramírez - +5491133445566 - Padre',
  })
  @Transform(({ value }) => cleanEmpty(value))
  @IsOptional()
  @IsString({ message: 'El contacto de emergencia debe ser un string.' })
  @MaxLength(255, {
    message: 'El contacto de emergencia debe tener entre 1 y 255 caracteres.',
  })
  emergency_contact?: string;

  @ApiPropertyOptional({
    description:
      'Latitud de la ubicación del usuario (debe estar entre -90 y 90)',
    example: -32.9468,
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
    example: -60.6393,
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
    example: 'esteban.ramirez@email.com',
  })
  @IsNotEmpty()
  @IsEmail(
    {},
    { message: 'El correo electrónico debe tener un formato válido.' },
  )
  email: string;

  @ApiProperty({
    description:
      'Contraseña del usuario (debe contener al menos una minúscula, una mayúscula y un número; el carácter especial es opcional)',
    example: 'EstebanPass456!',
    minLength: 6,
    maxLength: 100,
  })
  @Transform(({ value }) => cleanEmpty(value))
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
    example: 'EstebanPass456!',
  })
  @Transform(({ value }) => cleanEmpty(value))
  @IsNotEmpty({ message: 'La confirmación de contraseña es obligatoria.' })
  @IsString({ message: 'La confirmación de contraseña debe ser un string.' })
  @Validate(MatchPasswordHelper, ['password'])
  confirmPassword: string;
}
