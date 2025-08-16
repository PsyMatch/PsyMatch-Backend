import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { EPsychologistSpecialty } from '../../psychologist/enums/specialities.enum';
import { EPsychologistStatus } from '../../psychologist/enums/verified.enum';
import { EAvailability } from '../../psychologist/enums/availability.enum';
import { ELanguage } from '../../psychologist/enums/languages.enum';
import { EModality } from '../../psychologist/enums/modality.enum';
import { ESessionType } from '../../psychologist/enums/session-types.enum';
import { ETherapyApproach } from '../../psychologist/enums/therapy-approaches.enum';
import { ERole } from '../../../common/enums/role.enum';
import { EInsurance } from '../../users/enums/insurances.enum';
import { ResponseUserDto } from '../../users/dto/response-user.dto';

export class ResponseProfessionalDto {
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
    description: 'Fecha de nacimiento del usuario',
    example: '2025-07-31',
    type: 'string',
    format: 'date',
  })
  @Expose()
  birthdate?: Date;

  @ApiPropertyOptional({
    description: 'Número de teléfono del usuario',
    example: '+5411123456789',
  })
  @Expose()
  phone?: string;

  @ApiPropertyOptional({
    description: 'DNI (Documento Nacional de Identidad)',
    example: 12345678,
  })
  @Expose()
  dni?: number;

  @ApiPropertyOptional({
    description: 'Dirección del usuario',
    example: 'Av. Siempre Viva 742',
  })
  @Expose()
  address?: string;

  @ApiPropertyOptional({
    description: 'Dirección del consultorio (solo para psicólogos)',
    example: 'Av. Corrientes 1234, Oficina 302, Buenos Aires',
  })
  @Expose()
  office_address?: string;

  //===============================
  // DESCOMENTAR CUANDO USEMOS MAPS
  //===============================
  // @ApiPropertyOptional({
  //   description: 'Latitud de ubicación del usuario',
  //   example: -34.6037,
  // })
  // @Expose()
  // latitude?: number;

  // @ApiPropertyOptional({
  //   description: 'Longitud de ubicación del usuario',
  //   example: -58.3816,
  // })
  // @Expose()
  // longitude?: number;

  @ApiProperty({
    description: 'Dirección de correo electrónico del usuario',
    example: 'juan.perez@ejemplo.com',
  })
  @Expose()
  email: string;

  @ApiPropertyOptional({
    description: 'Proveedor de obra social',
    enum: EInsurance,
    example: EInsurance.OSDE,
  })
  @Expose()
  health_insurance?: EInsurance;

  @ApiPropertyOptional({
    description: 'Información de contacto de emergencia',
    example: 'María Pérez - +5411987654321 - Madre',
  })
  @Expose()
  emergency_contact?: string;

  @ApiPropertyOptional({
    description:
      'Psicólogos asignados (solo se llena cuando el rol del usuario es PACIENTE o ADMIN)',
    type: () => ResponseProfessionalDto,
    isArray: true,
  })
  @Expose()
  @Type(() => ResponseProfessionalDto)
  psychologists?: ResponseProfessionalDto[];

  @ApiPropertyOptional({
    description: 'Título profesional (solo para psicólogos)',
    example: 'Psicólogo Clínico',
  })
  @Expose()
  professional_title?: string;

  @ApiPropertyOptional({
    description: 'Número de matrícula profesional (solo para psicólogos)',
    example: 123456,
  })
  @Expose()
  license_number?: number;

  @ApiPropertyOptional({
    description: 'Biografía personal (solo para psicólogos)',
    example:
      'Psicólogo especializado en terapia cognitivo conductual con 10 años de experiencia.',
  })
  @Expose()
  personal_biography?: string;

  @ApiPropertyOptional({
    description: 'Años de experiencia profesional (solo para psicólogos)',
    example: 5,
  })
  @Expose()
  professional_experience?: number;

  @ApiPropertyOptional({
    description: 'Idiomas hablados (solo para psicólogos)',
    enum: ELanguage,
    isArray: true,
    example: ['spanish', 'english'],
  })
  @Expose()
  languages: ELanguage[] | null;

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
    description: 'Estado de verificación (solo para psicólogos)',
    enum: EPsychologistStatus,
    example: EPsychologistStatus.VALIDATED,
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
    example: ERole.PATIENT,
  })
  @Expose()
  role: ERole;

  @ApiPropertyOptional({
    description: 'URL de la foto de perfil del usuario',
    example: 'https://ejemplo.com/perfil.jpg',
  })
  @Expose()
  profile_picture?: string;
}
