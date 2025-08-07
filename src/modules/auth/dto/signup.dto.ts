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
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MatchPasswordHelper } from '../../utils/helpers/matchPassword.helper';

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
    description: 'User phone number',
    example: 1123456789,
  })
  @IsOptional()
  phone?: number;

  @ApiPropertyOptional({
    description: 'User address',
    example: 'Av. Corrientes 1234, Buenos Aires, Argentina',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'User location latitude (must be between -90 and 90)',
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
    description: 'User location longitude (must be between -180 and 180)',
    example: -58.3816,
    minimum: -180,
    maximum: 180,
  })
  @IsOptional()
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

  @ApiProperty({
    description:
      'User password (must contain at least one lowercase letter, one uppercase letter, one number, and one special character)',
    example: 'SecurePass123!',
    minLength: 8,
    maxLength: 100,
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/, {
    message:
      'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
  })
  @Length(8, 100, {
    message: 'The length of the password must be  between 8 and 100 characters',
  })
  password: string;

  @ApiProperty({
    description: 'Password confirmation (must match the password)',
    example: 'SecurePass123!',
  })
  @Validate(MatchPasswordHelper, ['password'])
  confirmPassword: string;
}
