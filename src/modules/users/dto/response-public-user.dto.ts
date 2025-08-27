import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { EPsychologistSpecialty } from '../../psychologist/enums/specialities.enum';
import { EPsychologistStatus } from '../../psychologist/enums/verified.enum';
import { EInsurance } from '../enums/insurances.enum';
import { EAvailability } from '../../psychologist/enums/availability.enum';
import { ELanguage } from '../../psychologist/enums/languages.enum';
import { EModality } from '../../psychologist/enums/modality.enum';
import { ESessionType } from '../../psychologist/enums/session-types.enum';
import { ETherapyApproach } from '../../psychologist/enums/therapy-approaches.enum';
import { EWorkingHours } from '../../psychologist/enums/working-hours.enum';
import { ERole } from '../../../common/enums/role.enum';

export class ResponsePublicUserDto {
  @ApiProperty({
    description: 'Identificador único del usuario',
    example: '4fc84832-3908-4639-8222-ecd5096120a2',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan Pérez',
  })
  @Expose()
  name: string;

  @ApiPropertyOptional({
    description: 'Alias del usuario',
    example: 'juanito',
  })
  @Expose()
  alias?: string;

  @ApiPropertyOptional({
    description: 'Número de teléfono del usuario',
    example: '+5411123456789',
  })
  @Expose()
  @Transform(
    ({ obj }: { obj: ResponsePublicUserDto }) =>
      obj.role === ERole.PSYCHOLOGIST ? obj.phone : Exclude(),
    { toPlainOnly: true },
  )
  phone?: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'usuario@ejemplo.com',
  })
  @Expose()
  email: string;

  @ApiPropertyOptional({
    description: 'URL de la foto de perfil del usuario',
    example: 'https://ejemplo.com/perfil.jpg',
  })
  @Expose()
  profile_picture?: string;

  @ApiProperty({
    description: 'Rol del usuario',
    enum: ERole,
    example: ERole.PATIENT,
  })
  @Expose()
  role: ERole;

  @ApiPropertyOptional({
    description: 'Biografía personal (solo para psicólogos)',
    example:
      'Psicólogo especializado en terapia cognitivo conductual con 10 años de experiencia.',
  })
  @Expose()
  personal_biography?: string;

  @ApiPropertyOptional({
    description: 'Título profesional (solo para psicólogos)',
    example: 'Psicólogo Clínico',
  })
  @Expose()
  professional_title?: string;

  @ApiPropertyOptional({
    description: 'Años de experiencia profesional (solo para psicólogos)',
    example: 5,
  })
  @Expose()
  professional_experience?: number;

  @ApiPropertyOptional({
    description: 'Especialidades (solo para psicólogos)',
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
    description: 'Idiomas hablados (solo para psicólogos)',
    enum: ELanguage,
    isArray: true,
    example: ['spanish', 'english'],
  })
  @Expose()
  languages?: ELanguage[];

  @ApiPropertyOptional({
    description: 'Enfoques terapéuticos (solo para psicólogos)',
    enum: ETherapyApproach,
    isArray: true,
    example: ['cognitive_behavioral_therapy', 'psychodynamic_therapy'],
  })
  @Expose()
  therapy_approaches?: ETherapyApproach[];

  @ApiPropertyOptional({
    description: 'Tipos de sesión ofrecidos (solo para psicólogos)',
    enum: ESessionType,
    isArray: true,
    example: ['individual', 'couple'],
  })
  @Expose()
  session_types?: string[];

  @ApiPropertyOptional({
    description: 'Modalidad de consulta (solo para psicólogos)',
    enum: EModality,
    example: 'in_person',
  })
  @Expose()
  modality?: string;

  @ApiPropertyOptional({
    description: 'Proveedores de seguros aceptados (solo para psicólogos)',
    enum: EInsurance,
    isArray: true,
    example: [EInsurance.OSDE, EInsurance.SWISS_MEDICAL, EInsurance.IOMA],
  })
  @Expose()
  insurance_accepted?: EInsurance[];

  @ApiPropertyOptional({
    description: 'Disponibilidad (solo para psicólogos)',
    enum: EAvailability,
    isArray: true,
    example: ['monday', 'wednesday', 'friday'],
  })
  @Expose()
  availability?: EAvailability[];

  @ApiPropertyOptional({
    description: 'Horarios de trabajo (solo para psicólogos)',
    enum: EWorkingHours,
    isArray: true,
    example: ['08:00', '09:00', '10:00', '14:00', '15:00'],
  })
  @Expose()
  working_hours?: EWorkingHours[];

  @ApiPropertyOptional({
    description: 'Tarifa de consulta (solo para psicólogos)',
    example: 5000,
  })
  @Expose()
  consultation_fee?: number;

  @ApiPropertyOptional({
    description: 'Estado de verificación (solo para psicólogos)',
    enum: EPsychologistStatus,
    example: EPsychologistStatus.VALIDATED,
  })
  @Expose()
  verified?: EPsychologistStatus;

  @ApiPropertyOptional({
    description: 'Dirección del consultorio (solo para psicólogos)',
    example: 'Av. Corrientes 1234, Oficina 302, Buenos Aires',
  })
  @Expose()
  office_address?: string;
}
