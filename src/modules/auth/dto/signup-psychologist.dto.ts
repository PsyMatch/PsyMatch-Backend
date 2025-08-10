import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsEnum,
  IsArray,
  ArrayNotEmpty,
  Matches,
  IsNumber,
  IsInt,
  IsPositive,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { EPsychologistSpecialty } from '../../psychologist/enums/specialities.enum';

const transformToNumber = (value: unknown): number | undefined => {
  if (typeof value === 'string' && value.trim() !== '') {
    const num = Number(value);
    return isNaN(num) ? undefined : num;
  }
  return typeof value === 'number' ? value : undefined;
};

export class SignUpPsychologistDto {
  @ApiProperty({
    description: 'Full name of the psychologist',
    example: 'Dr. Ana García',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'DNI (National Identity Document)',
    example: 87654321,
    minimum: 1000000,
    maximum: 99999999,
  })
  @IsNotEmpty({ message: 'DNI is required' })
  @Transform(({ value }: { value: unknown }) => transformToNumber(value))
  @IsNumber({}, { message: 'DNI must be a number' })
  @IsInt({ message: 'DNI must be an integer' })
  @IsPositive({ message: 'DNI must be a positive number' })
  dni: number;

  @ApiProperty({
    description: 'Email address (must be unique)',
    example: 'ana.garcia@psychologist.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Password with security requirements',
    example: 'SecurePass123!',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Password confirmation (must match password)',
    example: 'SecurePass123!',
  })
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;

  @ApiProperty({
    description: 'Social security number (must be unique)',
    example: '987-65-4321',
  })
  @IsString()
  @IsNotEmpty()
  social_security_number: string;

  @ApiProperty({
    description: 'Phone number',
    example: '+5411777888999',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message:
      'Phone must be a valid international phone number (e.g., +5411123456789 or 1123456789)',
  })
  phone?: string;

  @ApiProperty({
    description: 'Address',
    example: 'Av. Callao 1000, Buenos Aires',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'Latitude coordinate',
    example: -34.6037,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    value && typeof value === 'string' ? parseFloat(value) : undefined,
  )
  latitude?: number;

  @ApiProperty({
    description: 'Longitude coordinate',
    example: -58.3816,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    value && typeof value === 'string' ? parseFloat(value) : undefined,
  )
  longitude?: number;

  @ApiProperty({
    description: 'Office address for consultations',
    example: 'Consultorio en Av. Callao 1000, Piso 5',
  })
  @IsString()
  @IsNotEmpty()
  office_address: string;

  @ApiProperty({
    description: 'License number',
    example: 'PSI-12345',
  })
  @IsString()
  @IsNotEmpty()
  license_number: string;

  @ApiProperty({
    description: 'Array of specialties',
    example: ['CLINICAL', 'COUNSELING'],
    enum: EPsychologistSpecialty,
    isArray: true,
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(EPsychologistSpecialty, { each: true })
  specialities: EPsychologistSpecialty[];
}
