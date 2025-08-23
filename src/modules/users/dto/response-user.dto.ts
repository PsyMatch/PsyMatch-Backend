import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Exclude, Transform, Type } from 'class-transformer';
import { EPsychologistSpecialty } from '../../psychologist/enums/specialities.enum';
import { EPsychologistStatus } from '../../psychologist/enums/verified.enum';
import { EInsurance } from '../enums/insurances.enum';
import { EAvailability } from '../../psychologist/enums/availability.enum';
import { ELanguage } from '../../psychologist/enums/languages.enum';
import { EModality } from '../../psychologist/enums/modality.enum';
import { ESessionType } from '../../psychologist/enums/session-types.enum';
import { ETherapyApproach } from '../../psychologist/enums/therapy-approaches.enum';
import { ERole } from '../../../common/enums/role.enum';

const formatDateTime = (value: unknown): string => {
  if (value instanceof Date) {
    return value.toLocaleString('es-AR', {
      timeZone: 'America/Argentina/Buenos_Aires',
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }
  return String(value);
};

export class ResponseUserDto {
  @ApiProperty({
    description: 'Identificador único del usuario',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Nombre del usuario',
  })
  @Expose()
  name: string;

  @ApiPropertyOptional({
    description: 'Alias del usuario',
  })
  @Expose()
  alias?: string;

  @ApiPropertyOptional({
    description: 'Fecha de nacimiento del usuario',
    type: 'string',
    format: 'date',
  })
  @Expose()
  birthdate?: Date;

  @ApiPropertyOptional({
    description: 'Número de teléfono del usuario',
  })
  @Expose()
  phone?: string;

  @ApiPropertyOptional({
    description: 'DNI (Documento Nacional de Identidad)',
  })
  @Expose()
  dni?: number;

  @ApiPropertyOptional({
    description: 'Dirección del usuario',
  })
  @Expose()
  address?: string;

  @ApiPropertyOptional({
    description: 'Dirección del consultorio (solo para psicólogos)',
  })
  @Expose()
  office_address?: string;

  @ApiProperty({
    description: 'Dirección de correo electrónico del usuario',
  })
  @Expose()
  email: string;

  @ApiPropertyOptional({
    description: 'Proveedor de obra social',
    enum: EInsurance,
  })
  @Expose()
  health_insurance?: EInsurance;

  @ApiPropertyOptional({
    description: 'Información de contacto de emergencia',
  })
  @Expose()
  emergency_contact?: string;

  @ApiPropertyOptional({
    description:
      'Psicólogos asignados (solo se llena cuando el rol del usuario es PACIENTE o ADMIN)',
    type: () => ResponseUserDto,
    isArray: true,
  })
  @Expose()
  @Type(() => ResponseUserDto)
  psychologists?: ResponseUserDto[];

  @ApiPropertyOptional({
    description: 'Título profesional (solo para psicólogos)',
  })
  @Expose()
  professional_title?: string;

  @ApiPropertyOptional({
    description: 'Número de matrícula profesional (solo para psicólogos)',
  })
  @Expose()
  license_number?: number;

  @ApiPropertyOptional({
    description: 'Biografía personal (solo para psicólogos)',
  })
  @Expose()
  personal_biography?: string;

  @ApiPropertyOptional({
    description: 'Años de experiencia profesional (solo para psicólogos)',
  })
  @Expose()
  professional_experience?: number;

  @ApiPropertyOptional({
    description: 'Idiomas hablados (solo para psicólogos)',
    enum: ELanguage,
    isArray: true,
  })
  @Expose()
  languages?: ELanguage[];

  @ApiPropertyOptional({
    description: 'Enfoques terapéuticos (solo para psicólogos)',
    enum: ETherapyApproach,
    isArray: true,
  })
  @Expose()
  therapy_approaches?: ETherapyApproach[];

  @ApiPropertyOptional({
    description: 'Tipos de sesión ofrecidos (solo para psicólogos)',
    enum: ESessionType,
    isArray: true,
  })
  @Expose()
  session_types?: string[];

  @ApiPropertyOptional({
    description: 'Modalidad de consulta (solo para psicólogos)',
    enum: EModality,
  })
  @Expose()
  modality?: string;

  @ApiPropertyOptional({
    description: 'Especialidades (solo para psicólogos)',
    enum: EPsychologistSpecialty,
    isArray: true,
  })
  @Expose()
  specialities?: EPsychologistSpecialty[];

  @ApiPropertyOptional({
    description: 'Proveedores de seguros aceptados (solo para psicólogos)',
    enum: EInsurance,
    isArray: true,
  })
  @Expose()
  insurance_accepted?: EInsurance[];

  @ApiPropertyOptional({
    description: 'Disponibilidad (solo para psicólogos)',
    enum: EAvailability,
    isArray: true,
  })
  @Expose()
  availability?: EAvailability[];

  @ApiPropertyOptional({
    description: 'Precio de la consulta (solo para psicólogos)',
  })
  @Expose()
  consultation_fee?: number;

  @ApiPropertyOptional({
    description: 'Estado de verificación (solo para psicólogos)',
    enum: EPsychologistStatus,
  })
  @Expose()
  verified?: EPsychologistStatus;

  @ApiPropertyOptional({
    description:
      'Pacientes asignados (solo se llena cuando el rol del usuario es PSICÓLOGO)',
    type: () => ResponseUserDto,
    isArray: true,
  })
  @Expose()
  @Type(() => ResponseUserDto)
  patients?: ResponseUserDto[];

  @ApiProperty({
    description: 'Rol del usuario',
    enum: ERole,
  })
  @Expose()
  role: ERole;

  @ApiPropertyOptional({
    description: 'URL de la foto de perfil del usuario',
  })
  @Expose()
  profile_picture?: string;

  @ApiProperty({
    description: 'Fecha de creación del usuario',
    type: 'string',
  })
  @Transform(({ value }) => formatDateTime(value))
  @Expose()
  created_at: string;

  @ApiProperty({
    description: 'Fecha de último inicio de sesión del usuario',
    type: 'string',
  })
  @Transform(({ value }) => formatDateTime(value))
  @Expose()
  last_login: string;

  @ApiProperty({
    description: 'Fecha de actualización del usuario',
    type: 'string',
  })
  @Transform(({ value }) => formatDateTime(value))
  @Expose()
  updated_at: string;
}
