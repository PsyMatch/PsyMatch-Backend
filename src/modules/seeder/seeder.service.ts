import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { Patient } from '../users/entities/patient.entity';
import { Admin } from '../users/entities/admin.entity';
import { Psychologist } from '../psychologist/entities/psychologist.entity';
import { ERole } from '../../common/enums/role.enum';
import { EPsychologistSpecialty } from '../psychologist/enums/specialities.enum';
import { EPsychologistStatus } from '../psychologist/enums/verified.enum';
import { ESessionType } from '../psychologist/enums/session-types.enum';
import { ETherapyApproach } from '../psychologist/enums/therapy-approaches.enum';
import { envs } from '../../configs/envs.config';
import { EModality } from '../psychologist/enums/modality.enum';
import { EInsurance } from '../users/enums/insurances.enum';
import { ELanguage } from '../psychologist/enums/languages.enum';
import { EAvailability } from '../psychologist/enums/availability.enum';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(Psychologist)
    private readonly psychologistRepository: Repository<Psychologist>,
  ) {}

  async seedUsers() {
    const hashPassword = (pass: string) => bcrypt.hash(pass, 10);

    const adminUser = [
      {
        name: 'PsyMatch',
        alias: 'admin',
        email: 'psymatch.contact@gmail.com',
        password: await hashPassword('Elmejorteam4!'),
        role: ERole.ADMIN,
      },
    ];

    await this.adminRepository.upsert(adminUser, ['email']);
    if (envs.server.environment !== 'production') {
      console.log('✅ Admin seeded successfully');
    }

    const patients = [
      {
        name: 'Juan Carlos Pérez',
        alias: 'Juanito',
        email: 'juan.perez@email.com',
        password: await hashPassword('SecurePass123!'),
        dni: 12345679,
        address: 'Av. Corrientes 1234, Buenos Aires',
        phone: '+5411123456789',
        birthdate: '1990-05-15',
        health_insurance: EInsurance.SWISS_MEDICAL,
        role: ERole.PATIENT,
        emergency_contact: 'María Pérez - +5411987654321 - Madre',
        latitude: -34.6037,
        longitude: -58.3816,
        profile_picture: 'https://example.com/profile/juan-perez.jpg',
      },
      {
        name: 'María González',
        alias: 'Mary',
        email: 'maria.gonzalez@email.com',
        password: await hashPassword('SecurePass123!'),
        dni: 12345680,
        address: 'Calle Falsa 123, Rosario',
        phone: '+5411987654321',
        birthdate: '1985-08-22',
        health_insurance: EInsurance.IOMA,
        role: ERole.PATIENT,
        emergency_contact: 'Carlos González - +5411122334455 - Padre',
        profile_picture:
          'https://res.cloudinary.com/dibnkd72j/image/upload/v1755031810/default-profile-picture_lzshvt.webp',
      },
      {
        name: 'Pedro Rodríguez',
        alias: 'Pedro',
        email: 'pedro.rodriguez@email.com',
        password: await hashPassword('SecurePass123!'),
        dni: 12345681,
        address: 'San Martín 456, Córdoba',
        phone: '+5411777555333',
        birthdate: '1992-12-10',
        health_insurance: EInsurance.PAMI,
        role: ERole.PATIENT,
        latitude: -31.4167,
        longitude: -64.1833,
        profile_picture:
          'https://res.cloudinary.com/dibnkd72j/image/upload/v1755031810/default-profile-picture_lzshvt.webp',
      },
      {
        name: 'Ana López',
        alias: 'Anita',
        email: 'ana.lopez@email.com',
        password: await hashPassword('SecurePass123!'),
        dni: 12345682,
        address: 'Rivadavia 789, La Plata',
        phone: '+5411444555666',
        birthdate: '1988-07-03',
        health_insurance: EInsurance.OSDE,
        role: ERole.PATIENT,
        profile_picture:
          'https://res.cloudinary.com/dibnkd72j/image/upload/v1755031810/default-profile-picture_lzshvt.webp',
      },
      {
        name: 'Carlos Martínez',
        alias: 'Carlinhos',
        email: 'carlos.martinez@email.com',
        password: await hashPassword('SecurePass123!'),
        dni: 12345683,
        address: 'Belgrano 321, Mendoza',
        phone: '+5411333444555',
        birthdate: '1995-03-28',
        health_insurance: EInsurance.SANCOR_SALUD,
        role: ERole.PATIENT,
        emergency_contact: 'Laura Martínez - +541155667788 - Hermana',
        profile_picture:
          'https://res.cloudinary.com/dibnkd72j/image/upload/v1755031810/default-profile-picture_lzshvt.webp',
      },
      {
        name: 'Laura Fernández',
        alias: 'LauraF',
        email: 'laura.fernandez@email.com',
        password: await hashPassword('SecurePass123!'),
        dni: 12345684,
        address: 'Mitre 654, Tucumán',
        phone: '+5411888999000',
        birthdate: '1987-11-17',
        health_insurance: EInsurance.UNION_PERSONAL,
        role: ERole.PATIENT,
        profile_picture: 'https://example.com/profile/laura-fernandez.jpg',
      },
      {
        name: 'Sofía Ramírez',
        alias: 'Sofi',
        email: 'sofia.ramirez@email.com',
        password: await hashPassword('SecurePass123!'),
        dni: 12345685,
        address: 'Av. Santa Fe 123, Buenos Aires',
        phone: '+5411122334455',
        birthdate: '1993-04-12',
        health_insurance: EInsurance.OSDEPYM,
        role: ERole.PATIENT,
        profile_picture:
          'https://res.cloudinary.com/dibnkd72j/image/upload/v1755031810/default-profile-picture_lzshvt.webp',
      },
      {
        name: 'Martín Castro',
        alias: 'Tincho',
        email: 'martin.castro@email.com',
        password: await hashPassword('SecurePass123!'),
        dni: 12345686,
        address: 'Calle 9 de Julio 456, Salta',
        phone: '+541155667788',
        birthdate: '1991-09-30',
        health_insurance: EInsurance.LUIS_PASTEUR,
        role: ERole.PATIENT,
        emergency_contact: 'Valentina Castro - +541166778899 - Esposa',
        profile_picture:
          'https://res.cloudinary.com/dibnkd72j/image/upload/v1755031810/default-profile-picture_lzshvt.webp',
      },
      {
        name: 'Valentina Torres',
        alias: 'Valen',
        email: 'valentina.torres@email.com',
        password: await hashPassword('SecurePass123!'),
        dni: 12345687,
        address: 'Av. Libertador 789, San Juan',
        phone: '+541166778899',
        birthdate: '1996-02-18',
        health_insurance: EInsurance.JERARQUICOS_SALUD,
        role: ERole.PATIENT,
        profile_picture:
          'https://res.cloudinary.com/dibnkd72j/image/upload/v1755031810/default-profile-picture_lzshvt.webp',
      },
      {
        name: 'Federico Gómez',
        alias: 'Fede',
        email: 'federico.gomez@email.com',
        password: await hashPassword('SecurePass123!'),
        dni: 12345688,
        address: 'Calle Moreno 321, Córdoba',
        phone: '+541177788899',
        birthdate: '1989-06-25',
        health_insurance: EInsurance.OSECAC,
        role: ERole.PATIENT,
        latitude: -31.4167,
        longitude: -64.1833,
        profile_picture:
          'https://res.cloudinary.com/dibnkd72j/image/upload/v1755031810/default-profile-picture_lzshvt.webp',
      },
      {
        name: 'Camila Herrera',
        alias: 'Cami',
        email: 'camila.herrera@email.com',
        password: await hashPassword('SecurePass123!'),
        dni: 12345689,
        address: 'Av. San Martín 654, Mar del Plata',
        phone: '+541144455577',
        birthdate: '1994-11-05',
        health_insurance: EInsurance.OSMECON_SALUD,
        role: ERole.PATIENT,
        profile_picture:
          'https://res.cloudinary.com/dibnkd72j/image/upload/v1755031810/default-profile-picture_lzshvt.webp',
      },
      {
        name: 'Luciano Díaz',
        alias: 'Lucho',
        email: 'luciano.diaz@email.com',
        password: await hashPassword('SecurePass123!'),
        dni: 12345690,
        address: 'Calle Sarmiento 987, Neuquén',
        phone: '+541188899911',
        birthdate: '1997-08-14',
        health_insurance: EInsurance.APROSS,
        role: ERole.PATIENT,
        emergency_contact: 'Sofía Díaz - +5411122334455 - Madre',
        profile_picture:
          'https://res.cloudinary.com/dibnkd72j/image/upload/v1755031810/default-profile-picture_lzshvt.webp',
      },
    ];

    await this.patientRepository.upsert(patients, ['email']);
    if (envs.server.environment !== 'production') {
      console.log('✅ Patients seeded successfully');
    }

    const psychologists = [
      {
        name: 'Ana García',
        email: 'ana.garcia@psychologist.com',
        password: await hashPassword('SecurePass123!'),
        dni: 87654321,
        address: 'Av. Callao 1000, Buenos Aires',
        phone: '+5411777888999',
        birthdate: '1980-10-10',
        role: ERole.PSYCHOLOGIST,
        personal_biography:
          'Experienced psychologist specializing in cognitive behavioral therapy and grief counseling with over 15 years of practice.',
        professional_title: 'Licenciada en Psicología',
        professional_experience: 15,
        languages: [ELanguage.SPANISH, ELanguage.ENGLISH],
        office_address: 'Consultorio en Av. Callao 1000, Piso 5',
        modality: EModality.IN_PERSON,
        license_number: 123456,
        specialities: [
          EPsychologistSpecialty.ANGER_MANAGEMENT,
          EPsychologistSpecialty.GRIEF_LOSS,
        ],
        insurance_accepted: [
          EInsurance.OSDE,
          EInsurance.SWISS_MEDICAL,
          EInsurance.IOMA,
        ],
        session_types: [ESessionType.INDIVIDUAL, ESessionType.COUPLE],
        therapy_approaches: [
          ETherapyApproach.COGNITIVE_BEHAVIORAL_THERAPY,
          ETherapyApproach.PSYCHODYNAMIC_THERAPY,
        ],
        availability: [
          EAvailability.MONDAY,
          EAvailability.TUESDAY,
          EAvailability.WEDNESDAY,
          EAvailability.THURSDAY,
          EAvailability.FRIDAY,
        ],
        verified: EPsychologistStatus.VALIDATED,
        profile_picture: 'https://example.com/profile/ana-garcia.jpg',
      },
      {
        name: 'Roberto Silva',
        email: 'roberto.silva@psychologist.com',
        password: await hashPassword('SecurePass123!'),
        dni: 87654322,
        address: 'Santa Fe 2000, Buenos Aires',
        phone: '+5411666777888',
        birthdate: '1975-03-15',
        role: ERole.PSYCHOLOGIST,
        personal_biography:
          'Family therapist and sleep disorders specialist with extensive experience in group therapy sessions.',
        professional_title: 'Doctor en Psicología Clínica',
        professional_experience: 20,
        languages: [ELanguage.SPANISH],
        office_address: 'Consultorio en Santa Fe 2000, Oficina 203',
        modality: EModality.HYBRID,
        license_number: 234567,
        specialities: [
          EPsychologistSpecialty.SLEEP_DISORDERS,
          EPsychologistSpecialty.FAMILY_THERAPY,
        ],
        insurance_accepted: [
          EInsurance.SWISS_MEDICAL,
          EInsurance.IOMA,
          EInsurance.PAMI,
        ],
        session_types: [ESessionType.FAMILY, ESessionType.GROUP],
        therapy_approaches: [
          ETherapyApproach.FAMILY_SYSTEMS_THERAPY,
          ETherapyApproach.GROUP_THERAPY,
        ],
        availability: [
          EAvailability.MONDAY,
          EAvailability.WEDNESDAY,
          EAvailability.FRIDAY,
          EAvailability.SATURDAY,
        ],
        verified: EPsychologistStatus.VALIDATED,
        profile_picture: 'https://example.com/profile/roberto-silva.jpg',
      },
      {
        name: 'Carmen Ruiz',
        email: 'carmen.ruiz@psychologist.com',
        password: await hashPassword('SecurePass123!'),
        dni: 87654323,
        address: 'Pueyrredón 1500, Buenos Aires',
        phone: '+5411555666777',
        birthdate: '1982-07-22',
        role: ERole.PSYCHOLOGIST,
        personal_biography:
          'Child and adolescent therapist with expertise in play therapy and family counseling.',
        professional_title: 'Especialista en Psicología Infantil',
        professional_experience: 8,
        languages: [ELanguage.SPANISH, ELanguage.PORTUGUESE],
        office_address: 'Consultorio virtual - Modalidad Online',
        modality: EModality.ONLINE,
        license_number: 345678,
        specialities: [
          EPsychologistSpecialty.CHILD_ADOLESCENT_THERAPY,
          EPsychologistSpecialty.FAMILY_THERAPY,
        ],
        insurance_accepted: [
          EInsurance.IOMA,
          EInsurance.PAMI,
          EInsurance.UNION_PERSONAL,
        ],
        session_types: [ESessionType.INDIVIDUAL, ESessionType.FAMILY],
        therapy_approaches: [
          ETherapyApproach.PLAY_THERAPY,
          ETherapyApproach.SOLUTION_FOCUSED_BRIEF_THERAPY,
        ],
        availability: [
          EAvailability.TUESDAY,
          EAvailability.THURSDAY,
          EAvailability.SUNDAY,
        ],
        verified: EPsychologistStatus.PENDING,
        profile_picture: 'https://example.com/profile/carmen-ruiz.jpg',
      },
      {
        name: 'Pablo Méndez',
        email: 'pablo.mendez@psychologist.com',
        password: await hashPassword('SecurePass123!'),
        dni: 87654324,
        address: 'Av. Rivadavia 200, Buenos Aires',
        phone: '+541133344455',
        birthdate: '1985-01-20',
        role: ERole.PSYCHOLOGIST,
        personal_biography:
          'Especialista en ansiedad y orientación vocacional.',
        professional_title: 'Magíster en Psicología Educacional',
        professional_experience: 12,
        languages: [ELanguage.SPANISH],
        office_address: 'Consultorio en Av. Rivadavia 200',
        modality: EModality.IN_PERSON,
        license_number: 456789,
        specialities: [
          EPsychologistSpecialty.ANXIETY_DISORDER,
          EPsychologistSpecialty.CAREER_COUNSELING,
        ],
        insurance_accepted: [EInsurance.OSDE, EInsurance.OSDEPYM],
        session_types: [ESessionType.INDIVIDUAL],
        therapy_approaches: [ETherapyApproach.ACCEPTANCE_COMMITMENT_THERAPY],
        availability: [EAvailability.MONDAY, EAvailability.THURSDAY],
        verified: EPsychologistStatus.VALIDATED,
        profile_picture: 'https://example.com/profile/pablo-mendez.jpg',
      },
      {
        name: 'Lucía Benítez',
        email: 'lucia.benitez@psychologist.com',
        password: await hashPassword('SecurePass123!'),
        dni: 87654325,
        address: 'Calle San Juan 300, Rosario',
        phone: '+541155556677',
        birthdate: '1990-05-10',
        role: ERole.PSYCHOLOGIST,
        personal_biography: 'Experta en depresión y trauma/PTSD.',
        professional_title: 'Especialista en Psicotrauma',
        professional_experience: 10,
        languages: [ELanguage.SPANISH, ELanguage.ENGLISH],
        office_address: 'Consultorio virtual',
        modality: EModality.ONLINE,
        license_number: 567890,
        specialities: [
          EPsychologistSpecialty.DEPRESSION,
          EPsychologistSpecialty.TRAUMA_PTSD,
        ],
        insurance_accepted: [EInsurance.IOMA, EInsurance.PAMI],
        session_types: [ESessionType.INDIVIDUAL, ESessionType.GROUP],
        therapy_approaches: [
          ETherapyApproach.DIALECTICAL_BEHAVIORAL_THERAPY,
          ETherapyApproach.GROUP_THERAPY,
        ],
        availability: [EAvailability.WEDNESDAY, EAvailability.FRIDAY],
        verified: EPsychologistStatus.PENDING,
        profile_picture: 'https://example.com/profile/lucia-benitez.jpg',
      },
      {
        name: 'Esteban Morales',
        email: 'esteban.morales@psychologist.com',
        password: await hashPassword('SecurePass123!'),
        dni: 87654326,
        address: 'Av. Belgrano 400, Mendoza',
        phone: '+541144445566',
        birthdate: '1978-12-05',
        role: ERole.PSYCHOLOGIST,
        personal_biography: 'Especialista en adicciones y dolor crónico.',
        professional_title: 'Licenciado en Psicología y Adicciones',
        professional_experience: 18,
        languages: [ELanguage.SPANISH],
        office_address: 'Consultorio en Av. Belgrano 400',
        modality: EModality.HYBRID,
        license_number: 678901,
        specialities: [
          EPsychologistSpecialty.ADDICTION_SUBSTANCE_ABUSE,
          EPsychologistSpecialty.CHRONIC_PAIN_MANAGEMENT,
        ],
        insurance_accepted: [EInsurance.SANCOR_SALUD, EInsurance.OSPRERA],
        session_types: [ESessionType.INDIVIDUAL, ESessionType.FAMILY],
        therapy_approaches: [ETherapyApproach.HUMANISTIC_CENTRED_THERAPY],
        availability: [EAvailability.TUESDAY, EAvailability.SATURDAY],
        verified: EPsychologistStatus.VALIDATED,
        profile_picture: 'https://example.com/profile/esteban-morales.jpg',
      },
      {
        name: 'Paula Suárez',
        email: 'paula.suarez@psychologist.com',
        password: await hashPassword('SecurePass123!'),
        dni: 87654327,
        address: 'Calle Mitre 500, Tucumán',
        phone: '+541188899900',
        birthdate: '1983-03-22',
        role: ERole.PSYCHOLOGIST,
        personal_biography: 'Experta en terapia de pareja y apoyo LGBTQIA.',
        professional_title: 'Especialista en Terapia de Pareja',
        professional_experience: 14,
        languages: [ELanguage.SPANISH, ELanguage.PORTUGUESE],
        office_address: 'Consultorio virtual',
        modality: EModality.ONLINE,
        license_number: 789012,
        specialities: [
          EPsychologistSpecialty.COUPLES_THERAPY,
          EPsychologistSpecialty.LGBTQIA,
        ],
        insurance_accepted: [EInsurance.UNION_PERSONAL, EInsurance.OSPIP],
        session_types: [ESessionType.COUPLE, ESessionType.GROUP],
        therapy_approaches: [
          ETherapyApproach.MINDFULNESS_BASED_THERAPY,
          ETherapyApproach.ART_THERAPY,
        ],
        availability: [EAvailability.THURSDAY, EAvailability.SUNDAY],
        verified: EPsychologistStatus.PENDING,
        profile_picture: 'https://example.com/profile/paula-suarez.jpg',
      },
      {
        name: 'Nicolás Herrera',
        email: 'nicolas.herrera@psychologist.com',
        password: await hashPassword('SecurePass123!'),
        dni: 87654328,
        address: 'Av. Libertador 600, San Juan',
        phone: '+541166778899',
        birthdate: '1987-07-18',
        role: ERole.PSYCHOLOGIST,
        personal_biography:
          'Especialista en bipolaridad y psicología geriátrica.',
        professional_title: 'Doctor en Psicología Geriátrica',
        professional_experience: 16,
        languages: [ELanguage.SPANISH, ELanguage.ENGLISH],
        office_address: 'Consultorio en Av. Libertador 600',
        modality: EModality.IN_PERSON,
        license_number: 890123,
        specialities: [
          EPsychologistSpecialty.BIPOLAR_DISORDER,
          EPsychologistSpecialty.GERIATRIC_PS,
        ],
        insurance_accepted: [EInsurance.OSDE, EInsurance.OSECAC],
        session_types: [ESessionType.INDIVIDUAL, ESessionType.FAMILY],
        therapy_approaches: [ETherapyApproach.GESTALT_THERAPY],
        availability: [EAvailability.WEDNESDAY, EAvailability.FRIDAY],
        verified: EPsychologistStatus.VALIDATED,
        profile_picture: 'https://example.com/profile/nicolas-herrera.jpg',
      },
      {
        name: 'Mariana López',
        email: 'mariana.lopez@psychologist.com',
        password: await hashPassword('SecurePass123!'),
        dni: 87654329,
        address: 'Calle Sarmiento 700, Neuquén',
        phone: '+541188899911',
        birthdate: '1992-11-30',
        role: ERole.PSYCHOLOGIST,
        personal_biography:
          'Experta en trastornos alimentarios y espectro autista.',
        professional_title: 'Licenciada en Psicología Clínica',
        professional_experience: 7,
        languages: [ELanguage.SPANISH],
        office_address: 'Consultorio virtual',
        modality: EModality.ONLINE,
        license_number: 901234,
        specialities: [
          EPsychologistSpecialty.EATING_DISORDER,
          EPsychologistSpecialty.AUTISM_SPECTRUM_DISORDER,
        ],
        insurance_accepted: [EInsurance.APROSS, EInsurance.OSPAT],
        session_types: [ESessionType.INDIVIDUAL],
        therapy_approaches: [
          ETherapyApproach.EYE_MOVEMENT_DESENSITIZATION_REPROCESSING,
        ],
        availability: [EAvailability.TUESDAY, EAvailability.SATURDAY],
        verified: EPsychologistStatus.PENDING,
        profile_picture: 'https://example.com/profile/mariana-lopez.jpg',
      },
    ];

    await this.psychologistRepository.upsert(psychologists, ['email']);
    if (envs.server.environment !== 'production') {
      console.log('✅ Psychologists seeded successfully');
    }
  }
}
