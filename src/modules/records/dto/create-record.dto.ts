import { IsNotEmpty, IsString, IsEnum, IsUUID, Length } from 'class-validator';
import { ETypeRecord } from '../enums/typeRecord.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRecordDto {
  @ApiProperty({
    description: 'ID del psicólogo que crea el historial médico',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsNotEmpty({ message: 'El ID del psicólogo es obligatorio' })
  @IsUUID('4', { message: 'El ID del psicólogo debe ser un UUID válido' })
  psychologist_id: string;

  @ApiProperty({
    description: 'ID del paciente/usuario para quien se crea el historial',
    example: '123e4567-e89b-12d3-a456-426614174001',
    format: 'uuid',
  })
  @IsNotEmpty({ message: 'El ID del usuario es obligatorio' })
  @IsUUID('4', { message: 'El ID del usuario debe ser un UUID válido' })
  user_id: string;

  @ApiProperty({
    description: 'Contenido detallado del historial médico o notas de sesión',
    example:
      'El paciente mostró una mejora significativa en el manejo de la ansiedad. Se discutieron estrategias de afrontamiento y se asignaron ejercicios para la próxima sesión.',
    minLength: 10,
    maxLength: 5000,
  })
  @IsNotEmpty({ message: 'El contenido del historial es obligatorio' })
  @IsString({ message: 'El contenido debe ser un string' })
  @Length(10, 5000, {
    message: 'El contenido debe tener entre 10 y 5000 caracteres',
  })
  content: string;

  @ApiProperty({
    description: 'Tipo/categoría del historial médico',
    enum: ETypeRecord,
    example: ETypeRecord.PERSONAL_NOTE,
    enumName: 'ETypeRecord',
  })
  @IsNotEmpty({ message: 'El tipo de historial es obligatorio' })
  @IsEnum(ETypeRecord, {
    message: `El tipo debe ser uno de: ${Object.values(ETypeRecord).join(', ')}`,
  })
  type: ETypeRecord;
}
