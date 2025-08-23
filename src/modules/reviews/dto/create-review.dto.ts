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
    description: 'Calificación dada por el usuario (1 a 5 estrellas)',
    example: 5,
    minimum: 1,
    maximum: 5,
    type: 'integer',
  })
  @IsInt({ message: 'La calificación debe ser un número entero.' })
  @Min(1, { message: 'La calificación debe ser al menos 1.' })
  @Max(5, { message: 'La calificación debe ser como máximo 5.' })
  rating: number;

  @ApiProperty({
    description:
      'Comentario detallado sobre el psicólogo y la experiencia de la sesión',
    example:
      '¡Excelente psicólogo! Muy profesional y comprensivo. La sesión fue muy útil y me sentí cómodo durante todo el tiempo.',
    maxLength: 500,
    minLength: 10,
  })
  @IsString({ message: 'El comentario debe ser un string.' })
  @IsNotEmpty({ message: 'El comentario no puede estar vacío.' })
  @MaxLength(500, { message: 'El comentario no puede exceder 500 caracteres.' })
  comment: string;

  @ApiProperty({
    description: 'UUID del psicólogo siendo reseñado',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsUUID(undefined, { message: 'El ID del psicólogo debe ser un UUID válido.' })
  psychologistId: string;
}
