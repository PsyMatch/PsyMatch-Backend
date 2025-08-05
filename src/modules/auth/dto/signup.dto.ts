import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Length,
  Validate,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MatchPasswordHelper } from 'src/modules/utils/helpers/matchPassword.helper';

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
