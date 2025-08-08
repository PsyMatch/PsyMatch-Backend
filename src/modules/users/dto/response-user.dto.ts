import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Psychologist } from '../../psychologist/entities/psychologist.entity';

export class ResponseUserDto {
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
    description: 'User birthdate in format (DD-MM-YYYY)',
    example: '15-05-1990',
  })
  @Expose()
  birthdate?: string;

  @ApiProperty({
    description: 'User DNI (National Identity Document)',
    example: 12345678,
  })
  @Expose()
  dni: number;

  @ApiProperty({
    description: 'User social security number (must be unique)',
    example: '123-45-6789',
  })
  @Expose()
  social_security_number: string;

  @ApiPropertyOptional({
    description: 'User address',
    example: 'Av. Siempre Fernet 742',
  })
  @Expose()
  address?: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  @Expose()
  email: string;

  @ApiPropertyOptional({
    description: 'Associated professionals/psychologists',
    type: () => Psychologist,
    isArray: true,
  })
  @Expose()
  professionals?: Psychologist[];
}
