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
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MatchPasswordHelper } from '../../utils/helpers/matchPassword.helper';

const transformToNumber = (value: unknown): number | undefined => {
  if (typeof value === 'string' && value.trim() !== '') {
    const num = Number(value);
    return isNaN(num) ? undefined : num;
  }
  return typeof value === 'number' ? value : undefined;
};

export class SignUpDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'Juan Carlos Pérez',
    minLength: 1,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'URL of the user profile picture',
    example: 'https://example.com/profile/juan-perez.jpg',
  })
  @IsOptional()
  @IsString()
  profile_picture?: string;

  @ApiPropertyOptional({
    description: 'User phone number (international format supported)',
    example: '+5411123456789',
  })
  @IsOptional()
  @IsString({ message: 'Phone must be a string.' })
  @Matches(/^(\+?[1-9]\d{1,14})$/, {
    message:
      'Phone must be a valid international phone number (e.g., +5411123456789 or 1123456789)',
  })
  @Length(8, 15, { message: 'Phone must be between 8 and 15 digits.' })
  phone?: string;

  @ApiPropertyOptional({
    description: 'User birthdate',
    example: '2001-05-01',
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Birthdate must be a valid date' })
  birthdate?: Date;

  @ApiPropertyOptional({
    description: 'User DNI (National Identity Document) - must be unique',
    example: 12345678,
    minimum: 1000000,
    maximum: 99999999,
  })
  @IsOptional()
  @Transform(({ value }) => transformToNumber(value))
  @IsNumber({}, { message: 'DNI must be a number' })
  @IsInt({ message: 'DNI must be an integer' })
  @IsPositive({ message: 'DNI must be a positive number' })
  @Min(1000000, { message: 'DNI must be at least 7 digits long' })
  @Max(99999999, { message: 'DNI must not exceed 8 digits' })
  dni?: number;

  @ApiPropertyOptional({
    description: 'User social security number (must be unique)',
    example: '123-45-6789',
  })
  @IsOptional()
  @IsString({ message: 'Social security number must be a string' })
  @Matches(/^\d{3}-\d{2}-\d{4}$/, {
    message: 'Social security number must be in the format XXX-XX-XXXX',
  })
  social_security_number?: string;

  @ApiPropertyOptional({
    description: 'User address',
    example: 'Av. Corrientes 1234, Buenos Aires, Argentina',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'Emergency contact information',
    example: 'María Pérez - +5411987654321 - Madre',
  })
  @IsOptional()
  @IsString({ message: 'Emergency contact must be a string' })
  @Length(1, 255, {
    message: 'Emergency contact must be between 1 and 255 characters',
  })
  emergency_contact?: string;

  @ApiPropertyOptional({
    description: 'User location latitude (must be between -90 and 90)',
    example: -34.6037,
    minimum: -90,
    maximum: 90,
  })
  @IsOptional()
  @Transform(({ value }) => transformToNumber(value))
  @IsNumber({}, { message: 'Latitude must be a number.' })
  @Min(-90, { message: 'Latitude must be between -90 and 90.' })
  @Max(90, { message: 'Latitude must be between -90 and 90.' })
  latitude?: number;

  @ApiPropertyOptional({
    description: 'User location longitude (must be between -180 and 180)',
    example: -58.3816,
    minimum: -180,
    maximum: 180,
  })
  @IsOptional()
  @Transform(({ value }) => transformToNumber(value))
  @IsNumber({}, { message: 'Longitude must be a number.' })
  @Min(-180, { message: 'Longitude must be between -180 and 180.' })
  @Max(180, { message: 'Longitude must be between -180 and 180.' })
  longitude?: number;

  @ApiProperty({
    description: 'User email address (must be unique)',
    example: 'juan.perez@email.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description:
      'User password (must contain at least one lowercase letter, one uppercase letter, one number, and one special character)',
    example: 'SecurePass123!',
    minLength: 8,
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'Password must be a string' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/, {
    message:
      'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
  })
  @Length(8, 100, {
    message: 'The length of the password must be  between 8 and 100 characters',
  })
  password?: string;

  @ApiPropertyOptional({
    description: 'Password confirmation (must match the password)',
    example: 'SecurePass123!',
  })
  @IsOptional()
  @Validate(MatchPasswordHelper, ['password'])
  confirmPassword?: string;
}
