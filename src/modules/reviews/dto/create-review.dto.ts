import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    description: 'Rating given by the user (1 to 5)',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsInt({ message: 'Rating must be an integer.' })
  @Min(1, { message: 'Rating must be at least 1.' })
  @Min(5, { message: 'Rating must be at most 5.' })
  rating: number;

  @ApiProperty({
    description: 'Comment about the psychologist',
    example: 'Great session, very helpful!',
    maxLength: 500,
  })
  @IsString({ message: 'Comment must be a string.' })
  @IsNotEmpty({ message: 'Comment cannot be empty.' })
  @MaxLength(500, { message: 'Comment cannot exceed 500 characters.' })
  comment: string;

  @ApiProperty({
    description: 'ID of the psychologist being reviewed',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'Psychologist ID must be a valid UUID.' })
  psychologistId: string;
}
