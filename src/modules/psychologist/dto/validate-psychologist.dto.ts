import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  Length,
  Matches,
  Validate,
} from 'class-validator';
import { MatchPasswordHelper } from 'src/modules/utils/helpers/matchPassword.helper';
import { EPsychologistSpecialty } from '../enums/specialities.enum';

export class CreatePsychologistDto {
  @ApiProperty({
    description: 'Full name of the psychologist',
    example: 'María Gómez',
    minLength: 1,
  })
  @IsNotEmpty({ message: 'Full name is required' })
  name: string;

  @ApiProperty({
    description: 'Email address of the psychologist',
    example: 'example@mail.com',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({
    description: 'Password for the psychologist account',
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

  @ApiProperty({
    description: 'License number of the psychologist',
    example: 'PSY-123456',
  })
  @IsNotEmpty({ message: 'License number is required' })
  licenseNumber: string;

  @ApiProperty({
    description: 'Specialties of the psychologist',
    example: ['CLINICAL', 'COUNSELING'],
    type: [String],
    enum: EPsychologistSpecialty,
    isArray: true,
  })
  @IsNotEmpty({ message: 'At least one specialty is required' })
  @IsArray()
  specialties?: EPsychologistSpecialty[];
}
