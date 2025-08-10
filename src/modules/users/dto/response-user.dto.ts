import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ERole } from '../../../common/enums/role.enum';
import { EPsychologistSpecialty } from '../../psychologist/enums/specialities.enum';
import { EPsychologistStatus } from '../../psychologist/enums/verified.enum';

export class ResponseUserDto {
  @ApiProperty({
    description: 'User unique identifier',
    example: '4fc84832-3908-4639-8222-ecd5096120a2',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'User name',
    example: 'John Doe',
  })
  @Expose()
  name: string;

  @ApiPropertyOptional({
    description: 'User profile picture URL',
    example: 'https://example.com/profile.jpg',
  })
  @Expose()
  profile_picture?: string;

  @ApiPropertyOptional({
    description: 'User phone number',
    example: '+5411123456789',
  })
  @Expose()
  phone?: string;

  @ApiPropertyOptional({
    description: 'User birthdate',
    example: '2025-07-31',
    type: 'string',
    format: 'date',
  })
  @Expose()
  birthdate?: Date;

  @ApiPropertyOptional({
    description: 'User DNI (National Identity Document)',
    example: 12345678,
  })
  @Expose()
  dni?: number;

  @ApiPropertyOptional({
    description: 'User social security number (must be unique)',
    example: '123-45-6789',
  })
  @Expose()
  social_security_number?: string;

  @ApiPropertyOptional({
    description: 'User address',
    example: 'Av. Siempre Fernet 742',
  })
  @Expose()
  address?: string;

  @ApiPropertyOptional({
    description: 'Emergency contact information',
    example: 'María Pérez - +5411987654321 - Madre',
  })
  @Expose()
  emergency_contact?: string;

  @ApiPropertyOptional({
    description: 'User location latitude',
    example: -34.6037,
  })
  @Expose()
  latitude?: number;

  @ApiPropertyOptional({
    description: 'User location longitude',
    example: -58.3816,
  })
  @Expose()
  longitude?: number;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  @Expose()
  email: string;

  @ApiProperty({
    description: 'User role',
    enum: ERole,
    example: ERole.PATIENT,
  })
  @Expose()
  role: ERole;

  @ApiPropertyOptional({
    description: 'Office address (only for psychologists)',
    example: 'Av. Corrientes 1234, Oficina 302, Buenos Aires',
  })
  @Expose()
  office_address?: string;

  @ApiPropertyOptional({
    description: 'Verification status (only for psychologists)',
    enum: EPsychologistStatus,
    example: EPsychologistStatus.VALIDATED,
  })
  @Expose()
  verified?: EPsychologistStatus;

  @ApiPropertyOptional({
    description: 'Professional license number (only for psychologists)',
    example: 'PSI-12345-BA',
  })
  @Expose()
  license_number?: string;

  @ApiPropertyOptional({
    description: 'Specialties (only for psychologists)',
    enum: EPsychologistSpecialty,
    isArray: true,
    example: [
      EPsychologistSpecialty.BIPOLAR_DISORDER,
      EPsychologistSpecialty.DEPRESSION,
    ],
  })
  @Expose()
  specialities?: EPsychologistSpecialty[];

  @ApiPropertyOptional({
    description:
      'Assigned psychologists (only populated when user role is PATIENT or ADMIN)',
    type: () => ResponseUserDto,
    isArray: true,
  })
  @Expose()
  @Type(() => ResponseUserDto)
  psychologists?: ResponseUserDto[];

  @ApiPropertyOptional({
    description:
      'Assigned patients (only populated when user role is PSYCHOLOGIST)',
    type: () => ResponseUserDto,
    isArray: true,
  })
  @Expose()
  @Type(() => ResponseUserDto)
  patients?: ResponseUserDto[];
}
