import {
  IsOptional,
  IsString,
  IsEnum,
  IsUUID,
  Length,
  IsBoolean,
} from 'class-validator';
import { ETypeRecord } from '../enums/typeRecord.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRecordDto {
  @ApiPropertyOptional({
    description: 'ID del psicólogo (solo para actualizaciones administrativas)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID('4', { message: 'El ID del psicólogo debe ser un UUID válido' })
  psychologist_id?: string;

  @ApiPropertyOptional({
    description:
      'ID del paciente/usuario (solo para actualizaciones administrativas)',
    example: '123e4567-e89b-12d3-a456-426614174001',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID('4', { message: 'El ID del usuario debe ser un UUID válido' })
  user_id?: string;

  @ApiPropertyOptional({
    description: 'Contenido actualizado del historial médico o notas de sesión',
    example:
      'Actualización: El paciente mostró un excelente progreso en el manejo de la ansiedad. Completó todas las tareas asignadas y demostró nuevas técnicas de afrontamiento.',
    minLength: 10,
    maxLength: 5000,
  })
  @IsOptional()
  @IsString({ message: 'El contenido debe ser un string' })
  @Length(10, 5000, {
    message: 'El contenido debe tener entre 10 y 5000 caracteres',
  })
  content?: string;

  @ApiPropertyOptional({
    description: 'Tipo/categoría actualizada del historial médico',
    enum: ETypeRecord,
    example: ETypeRecord.PERSONAL_NOTE,
    enumName: 'ETypeRecord',
  })
  @IsOptional()
  @IsEnum(ETypeRecord, {
    message: `El tipo debe ser uno de: ${Object.values(ETypeRecord).join(', ')}`,
  })
  type?: ETypeRecord;

  @ApiPropertyOptional({
    description: 'Establecer el historial como activo o inactivo',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'is_active debe ser un valor booleano' })
  is_active?: boolean;
}
