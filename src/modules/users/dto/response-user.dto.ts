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
    example: 1234567890,
  })
  @Expose()
  phone?: number;

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
