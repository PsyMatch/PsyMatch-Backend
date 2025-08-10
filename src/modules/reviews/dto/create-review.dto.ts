import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  Max,
} from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    description: 'Rating given by the user (1 to 5 stars)',
    example: 5,
    minimum: 1,
    maximum: 5,
    type: 'integer',
  })
  @IsInt({ message: 'Rating must be an integer.' })
  @Min(1, { message: 'Rating must be at least 1.' })
  @Max(5, { message: 'Rating must be at most 5.' })
  rating: number;

  @ApiProperty({
    description:
      'Detailed comment about the psychologist and session experience',
    example:
      'Excellent psychologist! Very professional and understanding. The session was very helpful and I felt comfortable throughout.',
    maxLength: 500,
    minLength: 10,
  })
  @IsString({ message: 'Comment must be a string.' })
  @IsNotEmpty({ message: 'Comment cannot be empty.' })
  @MaxLength(500, { message: 'Comment cannot exceed 500 characters.' })
  comment: string;

  @ApiProperty({
    description: 'UUID of the psychologist being reviewed',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsUUID('4', { message: 'Psychologist ID must be a valid UUID.' })
  psychologistId: string;

  @ApiProperty({
    description: 'UUID of the user leaving the review',
    example: '987fcdeb-51a2-43d1-b234-567890abcdef',
    format: 'uuid',
  })
  @IsUUID('4', { message: 'User ID must be a valid UUID.' })
  userId: string;
}
