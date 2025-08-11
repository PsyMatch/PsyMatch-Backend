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
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { Psychologist } from '../../psychologist/entities/psychologist.entity';

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
    description: 'User full name',
    example: 'Juan Carlos Pérez',
  })
  @IsOptional()
  @IsString({ message: 'Name must be a string.' })
  @Length(1, 100, { message: 'Name must be between 1 and 100 characters.' })
  name?: string;

  @ApiPropertyOptional({
    description: 'User profile picture URL',
    example: 'https://example.com/profile/updated.jpg',
  })
  @IsOptional()
  @IsString({ message: 'Profile picture must be a string.' })
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
    example: '2025-07-31',
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Birthdate must be a valid date' })
  @Transform(({ value }) => transformToDate(value))
  birthdate?: Date;

  @ApiPropertyOptional({
    description: 'User DNI (National Identity Document) - must be unique',
    example: 12345678,
    minimum: 1000000,
    maximum: 99999999,
  })
  @IsOptional()
  @IsNumber({}, { message: 'DNI must be a number' })
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
    description: 'User address (updating this should also update coordinates)',
    example: 'Av. Corrientes 1234, Buenos Aires, Argentina',
  })
  @IsOptional()
  @IsString({ message: 'Address must be a string.' })
  @Length(3, 200, {
    message: 'Address must be between 3 and 200 characters.',
  })
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
    description: 'User email address (must be unique)',
    example: 'newemail@example.com',
  })
  @IsOptional()
  @IsString({ message: 'Email must be a string.' })
  @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
    message: 'Email must be a valid email address',
  })
  email?: string;

  @ApiPropertyOptional({
    description: 'User location latitude (updated when address changes)',
    example: -34.6037,
    minimum: -90,
    maximum: 90,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Latitude must be a number.' })
  @Min(-90, { message: 'Latitude must be between -90 and 90.' })
  @Max(90, { message: 'Latitude must be between -90 and 90.' })
  latitude?: number;

  @ApiPropertyOptional({
    description: 'User location longitude (updated when address changes)',
    example: -58.3816,
    minimum: -180,
    maximum: 180,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Longitude must be a number.' })
  @Min(-180, { message: 'Longitude must be between -180 and 180.' })
  @Max(180, { message: 'Longitude must be between -180 and 180.' })
  longitude?: number;

  @ApiPropertyOptional({
    description:
      'User password (must contain at least one lowercase letter, one uppercase letter, one number, and one special character)',
    example: 'NewSecurePass123!',
    minLength: 8,
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'Password must be a string.' })
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  @Length(8, 100, {
    message: 'Password must be between 8 and 100 characters.',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/, {
    message:
      'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
  })
  password?: string;

  @ApiPropertyOptional({
    description:
      'Assigned psychologists for this patient (only applicable when user role is PATIENT)',
    type: () => User,
    isArray: true,
  })
  @IsOptional()
  psychologists?: Psychologist[];
}
