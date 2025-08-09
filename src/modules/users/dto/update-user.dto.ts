import {
  IsOptional,
  IsString,
  IsNumber,
  Length,
  MinLength,
  Min,
  Max,
  Matches,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { Psychologist } from '../../psychologist/entities/psychologist.entity';

export class UpdateUserDto {
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
    description: 'User birthdate in format (DD-MM-YYYY)',
    example: '15-05-1990',
    pattern: '^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-[0-9]{4}$',
  })
  @IsOptional()
  @IsString({ message: 'Birthdate must be a string.' })
  @Matches(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-[0-9]{4}$/, {
    message: 'Birthdate must be in DD-MM-YYYY format (e.g., 15-05-1990)',
  })
  birthdate?: string;

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
