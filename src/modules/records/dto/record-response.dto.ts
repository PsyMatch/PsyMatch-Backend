import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ETypeRecord } from '../enums/typeRecord.enum';

export class RecordResponseDto {
  @ApiProperty({
    description: 'Identificador único del historial médico',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'ID del psicólogo que creó el historial',
    example: '123e4567-e89b-12d3-a456-426614174001',
    format: 'uuid',
  })
  @Expose()
  psychologist_id: string;

  @ApiProperty({
    description: 'ID del paciente/usuario al que pertenece este historial',
    example: '123e4567-e89b-12d3-a456-426614174002',
    format: 'uuid',
  })
  @Expose()
  user_id: string;

  @ApiProperty({
    description: 'Contenido del historial médico o notas de sesión',
    example:
      'El paciente mostró una mejora significativa en el manejo de la ansiedad. Se discutieron estrategias de afrontamiento y se asignaron ejercicios para la próxima sesión.',
  })
  @Expose()
  content: string;

  @ApiProperty({
    description: 'Tipo/categoría del historial médico',
    enum: ETypeRecord,
    example: ETypeRecord.PERSONAL_NOTE,
    enumName: 'ETypeRecord',
  })
  @Expose()
  type: ETypeRecord;

  @ApiProperty({
    description: 'Fecha y hora cuando se creó el historial',
    example: '2025-01-15T10:30:00.000Z',
    format: 'date-time',
  })
  @Expose()
  @Type(() => Date)
  created_at: Date;

  @ApiProperty({
    description: 'Fecha y hora cuando se actualizó por última vez el historial',
    example: '2025-01-15T11:15:00.000Z',
    format: 'date-time',
  })
  @Expose()
  @Type(() => Date)
  updated_at: Date;

  @ApiProperty({
    description: 'Indica si el historial sigue activo/disponible',
    example: true,
    default: true,
  })
  @Expose()
  is_active: boolean;
}
