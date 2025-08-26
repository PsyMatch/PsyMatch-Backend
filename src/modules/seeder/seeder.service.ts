import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { Patient } from '../users/entities/patient.entity';
import { Admin } from '../users/entities/admin.entity';
import { Psychologist } from '../psychologist/entities/psychologist.entity';
import { Reviews } from '../reviews/entities/reviews.entity';
import { Appointment } from '../appointments/entities/appointment.entity';
import { ERole } from '../../common/enums/role.enum';
import { AppointmentStatus } from '../appointments/enums/appointment-status.enum';
import { Payment, PayStatus, PayMethod } from '../payments/entities/payment.entity';
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
    @InjectRepository(Reviews)
    private readonly reviewsRepository: Repository<Reviews>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
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
      console.log('✅ Admin precargado exitosamente');
    }

    const patients = [
      // Pacientes con teléfonos únicos
      {
        name: 'Juan Carlos Pérez',
        alias: 'Juanito',
        email: 'juan.perez@email.com',
        password: await hashPassword('SecurePass123!'),
        dni: 12345679,
        address: 'Av. Corrientes 1234, Buenos Aires, Argentina',
        phone: '+5411123456781',
        birthdate: '1990-05-15',
        health_insurance: EInsurance.SWISS_MEDICAL,
        role: ERole.PATIENT,
        emergency_contact: 'María Pérez - +5411987654321 - Madre',
        profile_picture:
          'https://res.cloudinary.com/dibnkd72j/image/upload/v1755495603/default-pacient-profile-picture_kqpobf.webp',
      },
      {
        name: 'María González',
        alias: 'Mary',
        email: 'maria.gonzalez@email.com',
        password: await hashPassword('SecurePass123!'),
        dni: 12345680,
        address: 'Av. Florida 500, Buenos Aires, Argentina',
        phone: '+5411987654322',
        birthdate: '1985-08-22',
        health_insurance: EInsurance.IOMA,
        role: ERole.PATIENT,
        emergency_contact: 'Carlos González - +5411122334455 - Padre',
        profile_picture:
          'https://res.cloudinary.com/dibnkd72j/image/upload/v1755495603/default-pacient-profile-picture_kqpobf.webp',
      },
      {
        name: 'Pedro Rodríguez',
        alias: 'Pedro',
        email: 'pedro.rodriguez@email.com',
        password: await hashPassword('SecurePass123!'),
        dni: 12345681,
        address: 'Av. San Martín 456, Buenos Aires, Argentina',
        phone: '+5411777555334',
        birthdate: '1992-12-10',
        health_insurance: EInsurance.PAMI,
        role: ERole.PATIENT,
        profile_picture:
          'https://res.cloudinary.com/dibnkd72j/image/upload/v1755495603/default-pacient-profile-picture_kqpobf.webp',
      },
      {
        name: 'Ana López',
        alias: 'Anita',
        email: 'ana.lopez@email.com',
        password: await hashPassword('SecurePass123!'),
        dni: 12345682,
        address: 'Av. Rivadavia 789, Buenos Aires, Argentina',
        phone: '+5411444555667',
        birthdate: '1988-07-03',
        health_insurance: EInsurance.OSDE,
        role: ERole.PATIENT,
        profile_picture:
          'https://res.cloudinary.com/dibnkd72j/image/upload/v1755495603/default-pacient-profile-picture_kqpobf.webp',
      },
      {
        name: 'Carlos Martínez',
        alias: 'Carlinhos',
        email: 'carlos.martinez@email.com',
        password: await hashPassword('SecurePass123!'),
        dni: 12345683,
        address: 'Av. Belgrano 321, Buenos Aires, Argentina',
        phone: '+5411333444556',
        birthdate: '1995-03-28',
        health_insurance: EInsurance.SANCOR_SALUD,
        role: ERole.PATIENT,
        emergency_contact: 'Laura Martínez - +541155667788 - Hermana',
        profile_picture:
          'https://res.cloudinary.com/dibnkd72j/image/upload/v1755495603/default-pacient-profile-picture_kqpobf.webp',
      },
      {
        name: 'Laura Fernández',
        alias: 'LauraF',
        email: 'laura.fernandez@email.com',
        password: await hashPassword('SecurePass123!'),
        dni: 12345684,
        address: 'Av. Mitre 654, Buenos Aires, Argentina',
        phone: '+5411888999001',
        birthdate: '1987-11-17',
        health_insurance: EInsurance.UNION_PERSONAL,
        role: ERole.PATIENT,
        profile_picture:
          'https://res.cloudinary.com/dibnkd72j/image/upload/v1755495603/default-pacient-profile-picture_kqpobf.webp',
      },
      {
        name: 'Sofía Ramírez',
        alias: 'Sofi',
        email: 'sofia.ramirez@email.com',
        password: await hashPassword('SecurePass123!'),
        dni: 12345685,
        address: 'Av. Santa Fe 123, Buenos Aires, Argentina',
        phone: '+5411122334456',
        birthdate: '1993-04-12',
        health_insurance: EInsurance.OSDEPYM,
        role: ERole.PATIENT,
        profile_picture:
          'https://res.cloudinary.com/dibnkd72j/image/upload/v1755495603/default-pacient-profile-picture_kqpobf.webp',
      },
      {
        name: 'Martín Castro',
        alias: 'Tincho',
        email: 'martin.castro@email.com',
        password: await hashPassword('SecurePass123!'),
        dni: 12345686,
        address: 'Av. 9 de Julio 456, Buenos Aires, Argentina',
        phone: '+541155667789',
        birthdate: '1991-09-30',
        health_insurance: EInsurance.LUIS_PASTEUR,
        role: ERole.PATIENT,
        emergency_contact: 'Valentina Castro - +541166778899 - Esposa',
        profile_picture:
          'https://res.cloudinary.com/dibnkd72j/image/upload/v1755495603/default-pacient-profile-picture_kqpobf.webp',
      },
      {
        name: 'Valentina Torres',
        alias: 'Valen',
        email: 'valentina.torres@email.com',
        password: await hashPassword('SecurePass123!'),
        dni: 12345687,
        address: 'Av. Libertador 789, Buenos Aires, Argentina',
        phone: '+541166778890',
        birthdate: '1996-02-18',
        health_insurance: EInsurance.JERARQUICOS_SALUD,
        role: ERole.PATIENT,
        profile_picture:
          'https://res.cloudinary.com/dibnkd72j/image/upload/v1755495603/default-pacient-profile-picture_kqpobf.webp',
      },
      {
        name: 'Federico Gómez',
        alias: 'Fede',
        email: 'federico.gomez@email.com',
        password: await hashPassword('SecurePass123!'),
        dni: 12345688,
        address: 'Av. Moreno 321, Buenos Aires, Argentina',
        phone: '+541177788900',
        birthdate: '1989-06-25',
        health_insurance: EInsurance.OSECAC,
        role: ERole.PATIENT,
        profile_picture:
          'https://res.cloudinary.com/dibnkd72j/image/upload/v1755495603/default-pacient-profile-picture_kqpobf.webp',
      },
      {
        name: 'Camila Herrera',
        alias: 'Cami',
        email: 'camila.herrera@email.com',
        password: await hashPassword('SecurePass123!'),
        dni: 12345689,
        address: 'Av. San Martín 654, Buenos Aires, Argentina',
        phone: '+541144455578',
        birthdate: '1994-11-05',
        health_insurance: EInsurance.OSMECON_SALUD,
        role: ERole.PATIENT,
        profile_picture:
          'https://res.cloudinary.com/dibnkd72j/image/upload/v1755495603/default-pacient-profile-picture_kqpobf.webp',
      },
      {
        name: 'Luciano Díaz',
        alias: 'Lucho',
        email: 'luciano.diaz@email.com',
        password: await hashPassword('SecurePass123!'),
        dni: 12345690,
        address: 'Av. Sarmiento 987, Buenos Aires, Argentina',
        phone: '+541188899912',
        birthdate: '1997-08-14',
        health_insurance: EInsurance.APROSS,
        role: ERole.PATIENT,
        emergency_contact: 'Sofía Díaz - +5411122334455 - Madre',
        profile_picture:
          'https://res.cloudinary.com/dibnkd72j/image/upload/v1755495603/default-pacient-profile-picture_kqpobf.webp',
      },
    ];

    await this.patientRepository.upsert(patients, ['email']);
    if (envs.server.environment !== 'production') {
      console.log('✅ Pacientes precargados exitosamente');
    }

    const psychologists = [
      // Psicólogos con teléfonos únicos
      {
        name: 'Ana García',
        email: 'ana.garcia@psychologist.com',
        password: await hashPassword('SecurePass123!'),
        dni: 87654321,
        phone: '+5411777888991',
        birthdate: '1980-10-10',
        role: ERole.PSYCHOLOGIST,
        personal_biography:
          'Experienced psychologist specializing in cognitive behavioral therapy and grief counseling with over 15 years of practice.',
        professional_title: 'Licenciada en Psicología',
        professional_experience: 15,
        languages: [ELanguage.SPANISH, ELanguage.ENGLISH],
        office_address: 'Av. Callao 1000, Buenos Aires, Argentina',
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
        consultation_fee: 20000,
        verified: EPsychologistStatus.VALIDATED,
        profile_picture:
          'https://res.cloudinary.com/dibnkd72j/image/upload/v1755591733/default-female-psychologist-profile-picture_qyogmy.webp',
      },
      {
        name: 'Roberto Silva',
        email: 'roberto.silva@psychologist.com',
        password: await hashPassword('SecurePass123!'),
        dni: 87654322,
        phone: '+5411666777882',
        birthdate: '1975-03-15',
        role: ERole.PSYCHOLOGIST,
        personal_biography:
          'Family therapist and sleep disorders specialist with extensive experience in group therapy sessions.',
        professional_title: 'Doctor en Psicología Clínica',
        professional_experience: 20,
        languages: [ELanguage.SPANISH],
        office_address: 'Av. Santa Fe 2000, Buenos Aires, Argentina',
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
        consultation_fee: 22000,
        verified: EPsychologistStatus.VALIDATED,
        profile_picture:
          'https://res.cloudinary.com/dibnkd72j/image/upload/v1755591732/default-male-psychologist-profile-picture_sqyd1d.webp',
      },
      {
        name: 'Carmen Ruiz',
        email: 'carmen.ruiz@psychologist.com',
        password: await hashPassword('SecurePass123!'),
        dni: 87654323,
        phone: '+5411555666773',
        birthdate: '1982-07-22',
        role: ERole.PSYCHOLOGIST,
        personal_biography:
          'Child and adolescent therapist with expertise in play therapy and family counseling.',
        professional_title: 'Especialista en Psicología Infantil',
        professional_experience: 8,
        languages: [ELanguage.SPANISH, ELanguage.PORTUGUESE],
        office_address: 'Av. Pueyrredón 1500, Buenos Aires, Argentina',
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
        consultation_fee: 26000,
        verified: EPsychologistStatus.VALIDATED,
        profile_picture:
          'https://res.cloudinary.com/dibnkd72j/image/upload/v1755591733/default-female-psychologist-profile-picture_qyogmy.webp',
      },
      {
        name: 'Pablo Méndez',
        email: 'pablo.mendez@psychologist.com',
        password: await hashPassword('SecurePass123!'),
        dni: 87654324,
        phone: '+5411333444557',
        birthdate: '1985-01-20',
        role: ERole.PSYCHOLOGIST,
        personal_biography:
          'Especialista en ansiedad y orientación vocacional.',
        professional_title: 'Magíster en Psicología Educacional',
        professional_experience: 12,
        languages: [ELanguage.SPANISH],
        office_address: 'Av. Rivadavia 200, Buenos Aires, Argentina',
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
        profile_picture:
          'https://res.cloudinary.com/dibnkd72j/image/upload/v1755591732/default-male-psychologist-profile-picture_sqyd1d.webp',
      },
      {
        name: 'Lucía Benítez',
        email: 'lucia.benitez@psychologist.com',
        password: await hashPassword('SecurePass123!'),
        dni: 87654325,
        phone: '+541155556678',
        birthdate: '1990-05-10',
        role: ERole.PSYCHOLOGIST,
        personal_biography: 'Experta en depresión y trauma/PTSD.',
        professional_title: 'Especialista en Psicotrauma',
        professional_experience: 10,
        languages: [ELanguage.SPANISH, ELanguage.ENGLISH],
        office_address: 'Av. San Juan 300, Buenos Aires, Argentina',
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
        consultation_fee: 24500,
        verified: EPsychologistStatus.VALIDATED,
        profile_picture:
          'https://res.cloudinary.com/dibnkd72j/image/upload/v1755591733/default-female-psychologist-profile-picture_qyogmy.webp',
      },
      {
        name: 'Esteban Morales',
        email: 'esteban.morales@psychologist.com',
        password: await hashPassword('SecurePass123!'),
        dni: 87654326,
        phone: '+541144445569',
        birthdate: '1978-12-05',
        role: ERole.PSYCHOLOGIST,
        personal_biography: 'Especialista en adicciones y dolor crónico.',
        professional_title: 'Licenciado en Psicología y Adicciones',
        professional_experience: 18,
        languages: [ELanguage.SPANISH],
        office_address: 'Av. Belgrano 400, Buenos Aires, Argentina',
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
        consultation_fee: 25000,
        verified: EPsychologistStatus.VALIDATED,
        profile_picture:
          'https://res.cloudinary.com/dibnkd72j/image/upload/v1755591732/default-male-psychologist-profile-picture_sqyd1d.webp',
      },
      {
        name: 'Paula Suárez',
        email: 'paula.suarez@psychologist.com',
        password: await hashPassword('SecurePass123!'),
        dni: 87654327,
        phone: '+541188899902',
        birthdate: '1983-03-22',
        role: ERole.PSYCHOLOGIST,
        personal_biography: 'Experta en terapia de pareja y apoyo LGBTQIA.',
        professional_title: 'Especialista en Terapia de Pareja',
        professional_experience: 14,
        languages: [ELanguage.SPANISH, ELanguage.PORTUGUESE],
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
        verified: EPsychologistStatus.VALIDATED,
        consultation_fee: 30000,
        profile_picture:
          'https://res.cloudinary.com/dibnkd72j/image/upload/v1755591733/default-female-psychologist-profile-picture_qyogmy.webp',
      },
      {
        name: 'Nicolás Herrera',
        email: 'nicolas.herrera@psychologist.com',
        password: await hashPassword('SecurePass123!'),
        dni: 87654328,
        phone: '+541166778891',
        birthdate: '1987-07-18',
        role: ERole.PSYCHOLOGIST,
        personal_biography:
          'Especialista en bipolaridad y psicología geriátrica.',
        professional_title: 'Doctor en Psicología Geriátrica',
        professional_experience: 16,
        languages: [ELanguage.SPANISH, ELanguage.ENGLISH],
        office_address: 'Av. Libertador 600, Buenos Aires, Argentina',
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
        consultation_fee: 28000,
        profile_picture:
          'https://res.cloudinary.com/dibnkd72j/image/upload/v1755591732/default-male-psychologist-profile-picture_sqyd1d.webp',
      },
      {
        name: 'Mariana López',
        email: 'mariana.lopez@psychologist.com',
        password: await hashPassword('SecurePass123!'),
        dni: 87654329,
        phone: '+541188899913',
        birthdate: '1992-11-30',
        role: ERole.PSYCHOLOGIST,
        personal_biography:
          'Experta en trastornos alimentarios y espectro autista.',
        professional_title: 'Licenciada en Psicología Clínica',
        professional_experience: 7,
        languages: [ELanguage.SPANISH],
        office_address: 'Calle Sarmiento 700, Buenos Aires, Argentina',
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
        consultation_fee: 24800,
        verified: EPsychologistStatus.VALIDATED,
        profile_picture:
          'https://res.cloudinary.com/dibnkd72j/image/upload/v1755591733/default-female-psychologist-profile-picture_qyogmy.webp',
      },
    ];

    await this.psychologistRepository.upsert(psychologists, ['email']);
    if (envs.server.environment !== 'production') {
      console.log('✅ Psicólogos precargados exitosamente');
    }
  }

  async seedReviews() {
    // Primero obtenemos todos los psicólogos para asignarles reviews
    const psychologists = await this.psychologistRepository.find();

    // También necesitamos obtener pacientes para asignar como autores de las reviews
    const patients = await this.patientRepository.find();

    if (psychologists.length === 0) {
      console.log(
        '⚠️ No psychologists found. Please seed psychologists first.',
      );
      return;
    }

    if (patients.length === 0) {
      console.log('⚠️ No se encontraron pacientes. Por favor, carga los pacientes primero.');
      return;
    }

    const reviews = [
      {
        rating: 5,
        comment:
          '¡Excelente psicólogo! Muy profesional y comprensivo. La sesión fue muy útil y me sentí cómodo durante todo el tiempo. Definitivamente lo recomiendo.',
        review_date: new Date('2024-01-15'),
        userId: patients[0].id,
        psychologist: psychologists[0],
      },
      {
        rating: 4,
        comment:
          'Muy buena experiencia. El psicólogo es muy empático y me ayudó mucho con mis problemas de ansiedad. Las técnicas que me enseñó han sido muy efectivas.',
        review_date: new Date('2024-01-20'),
        userId: patients[1].id,
        psychologist: psychologists[0],
      },
      {
        rating: 5,
        comment:
          'Increíble profesional. Su enfoque cognitivo-conductual me ha cambiado la vida. Altamente recomendado para cualquier persona que busque ayuda profesional.',
        review_date: new Date('2024-02-01'),
        userId: patients[2].id,
        psychologist: psychologists[1],
      },
      {
        rating: 4,
        comment:
          'Muy profesional y paciente. Me ayudó a superar momentos difíciles con técnicas muy efectivas. El ambiente de la consulta es muy cómodo y relajante.',
        review_date: new Date('2024-02-10'),
        userId: patients[3].id,
        psychologist: psychologists[1],
      },
      {
        rating: 5,
        comment:
          'Excelente terapeuta especializada en terapia familiar. Nos ayudó mucho como pareja y ahora tenemos herramientas para comunicarnos mejor.',
        review_date: new Date('2024-02-15'),
        userId: patients[4].id,
        psychologist: psychologists[2],
      },
      {
        rating: 3,
        comment:
          'Buena experiencia en general. El psicólogo es conocedor, aunque a veces siento que las sesiones son un poco cortas. Aún así, me ha ayudado.',
        review_date: new Date('2024-02-20'),
        userId: patients[5].id,
        psychologist: psychologists[2],
      },
      {
        rating: 5,
        comment:
          'Fantástica experiencia con terapia EMDR. Me ayudó a procesar traumas pasados de manera muy efectiva. Totalmente recomendado para trauma.',
        review_date: new Date('2024-03-01'),
        userId: patients[6 % patients.length].id,
        psychologist: psychologists[3],
      },
      {
        rating: 4,
        comment:
          'Muy buena psicóloga especializada en adolescentes. Mi hija se sintió muy cómoda y ha mostrado mucha mejoría en sus problemas de autoestima.',
        review_date: new Date('2024-03-05'),
        userId: patients[7 % patients.length].id,
        psychologist: psychologists[3],
      },
      {
        rating: 5,
        comment:
          'Excelente profesional en terapia cognitivo-conductual. Sus técnicas para manejar la depresión han sido fundamentales en mi recuperación.',
        review_date: new Date('2024-03-10'),
        userId: patients[8 % patients.length].id,
        psychologist: psychologists[4] || psychologists[0],
      },
      {
        rating: 4,
        comment:
          'Muy recomendado. Buen manejo de la terapia humanística. Me ayudó a encontrar mi propósito y a desarrollar mayor autoconocimiento.',
        review_date: new Date('2024-03-15'),
        userId: patients[9 % patients.length].id,
        psychologist: psychologists[4] || psychologists[1],
      },
      {
        rating: 5,
        comment:
          'Increíble experiencia con terapia de pareja. Nos dio herramientas muy valiosas para mejorar nuestra relación y comunicación.',
        review_date: new Date('2024-03-20'),
        userId: patients[10 % patients.length].id,
        psychologist: psychologists[0],
      },
      {
        rating: 4,
        comment:
          'Muy profesional y empático. Me ayudó a superar mi fobia social con técnicas de exposición gradual. Muy recomendado.',
        review_date: new Date('2024-03-25'),
        userId: patients[11 % patients.length].id,
        psychologist: psychologists[1],
      },
      {
        rating: 5,
        comment:
          'Excelente terapeuta para niños. Mi hijo de 8 años se siente muy cómodo con ella y ha mejorado mucho su comportamiento en casa y en el colegio.',
        review_date: new Date('2024-04-01'),
        userId: patients[0].id,
        psychologist: psychologists[2],
      },
      {
        rating: 3,
        comment:
          'Experiencia positiva. El psicólogo es muy preparado académicamente, aunque a veces me gustaría más práctica y menos teoría en las sesiones.',
        review_date: new Date('2024-04-05'),
        userId: patients[1].id,
        psychologist: psychologists[3],
      },
      {
        rating: 5,
        comment:
          'Fantástico profesional. Su enfoque en mindfulness y técnicas de relajación me han ayudado enormemente con mi estrés laboral.',
        review_date: new Date('2024-04-10'),
        userId: patients[2].id,
        psychologist: psychologists[0],
      },
    ];

    await this.reviewsRepository.save(reviews);
    if (envs.server.environment !== 'production') {
      console.log('✅ Reseñas precargadas exitosamente');
    }
  }

  async seedAppointments() {
    // Primero obtenemos todos los psicólogos y pacientes
    const psychologists = await this.psychologistRepository.find();
    const patients = await this.patientRepository.find();

    if (psychologists.length === 0) {
      console.log(
        '⚠️ No psychologists found. Please seed psychologists first.',
      );
      return;
    }

    if (patients.length === 0) {
      console.log('⚠️ No se encontraron pacientes. Por favor, carga los pacientes primero.');
      return;
    }

    // Generar fechas para appointments (algunas pasadas, algunas futuras)
    const getRandomDate = (daysOffset: number) => {
      const date = new Date();
      date.setDate(date.getDate() + daysOffset);
      return date;
    };

    const getRandomHour = () => {
      const hours = [
        '09:00',
        '10:00',
        '11:00',
        '14:00',
        '15:00',
        '16:00',
        '17:00',
      ];
      return hours[Math.floor(Math.random() * hours.length)];
    };

    const appointments = [
      // Appointments completadas (pasadas)
      {
        date: getRandomDate(-30),
        hour: getRandomHour(),
        duration: 45,
        notes:
          'Primera sesión de evaluación. Paciente presenta síntomas de ansiedad.',
        patient: patients[0],
        psychologist: psychologists[0],
        status: AppointmentStatus.COMPLETED,
        modality: psychologists[0].modality,
        session_type: 'Individual',
        therapy_approach: 'Terapia Cognitivo-Conductual',
        insurance: 'OSDE',
        price: psychologists[0].consultation_fee,
      },
      {
        date: getRandomDate(-25),
        hour: getRandomHour(),
        duration: 45,
        notes:
          'Seguimiento de tratamiento para depresión. Paciente muestra mejoría.',
        patient: patients[1],
        psychologist: psychologists[1],
        status: AppointmentStatus.COMPLETED,
        modality: psychologists[1].modality,
        session_type: 'Individual',
        therapy_approach: 'Terapia Humanística',
        insurance: 'Swiss Medical',
        price: psychologists[1].consultation_fee,
      },
      {
        date: getRandomDate(-20),
        hour: getRandomHour(),
        duration: 60,
        notes: 'Sesión de terapia familiar. Trabajamos en comunicación.',
        patient: patients[2],
        psychologist: psychologists[2],
        status: AppointmentStatus.COMPLETED,
        modality: psychologists[2].modality,
        session_type: 'Familiar',
        therapy_approach: 'Terapia Sistémica',
        insurance: 'IOMA',
        price: psychologists[2].consultation_fee,
      },
      {
        date: getRandomDate(-15),
        hour: getRandomHour(),
        duration: 45,
        notes: 'Sesión de terapia de pareja. Conflictos de comunicación.',
        patient: patients[3],
        psychologist: psychologists[3],
        status: AppointmentStatus.COMPLETED,
        modality: psychologists[3].modality,
        session_type: 'Pareja',
        therapy_approach: 'Terapia de Pareja',
        insurance: 'PAMI',
        price: psychologists[3].consultation_fee,
      },
      {
        date: getRandomDate(-10),
        hour: getRandomHour(),
        duration: 45,
        notes: 'Tratamiento para trauma. Aplicamos técnicas EMDR.',
        patient: patients[4],
        psychologist: psychologists[4] || psychologists[0],
        status: AppointmentStatus.COMPLETED,
        modality: (psychologists[4] || psychologists[0]).modality,
        session_type: 'Individual',
        therapy_approach: 'EMDR',
        insurance: 'Union Personal',
        price: (psychologists[4] || psychologists[0]).consultation_fee,
      },

      // Appointments confirmadas (futuras)
      {
        date: getRandomDate(5),
        hour: getRandomHour(),
        duration: 45,
        notes: 'Cita de seguimiento programada.',
        patient: patients[5],
        psychologist: psychologists[0],
        status: AppointmentStatus.CONFIRMED,
        modality: psychologists[0].modality,
        session_type: 'Individual',
        therapy_approach: 'Terapia Cognitivo-Conductual',
        insurance: 'OSDE',
        price: psychologists[0].consultation_fee,
      },
      {
        date: getRandomDate(8),
        hour: getRandomHour(),
        duration: 45,
        notes: 'Sesión para trabajar técnicas de mindfulness.',
        patient: patients[6],
        psychologist: psychologists[1],
        status: AppointmentStatus.CONFIRMED,
        modality: psychologists[1].modality,
        session_type: 'Individual',
        therapy_approach: 'Mindfulness',
        insurance: 'Swiss Medical',
        price: psychologists[1].consultation_fee,
      },
      {
        date: getRandomDate(12),
        hour: getRandomHour(),
        duration: 60,
        notes: 'Evaluación inicial para terapia de grupo.',
        patient: patients[7],
        psychologist: psychologists[2],
        status: AppointmentStatus.CONFIRMED,
        modality: psychologists[2].modality,
        session_type: 'Grupal',
        therapy_approach: 'Terapia de Grupo',
        insurance: 'IOMA',
        price: psychologists[2].consultation_fee,
      },

      // Appointments pendientes
      {
        date: getRandomDate(15),
        hour: getRandomHour(),
        duration: 45,
        notes: 'Primera consulta. Evaluación inicial.',
        patient: patients[8],
        psychologist: psychologists[3],
        status: AppointmentStatus.PENDING,
        modality: psychologists[3].modality,
        session_type: 'Individual',
        therapy_approach: 'Por definir',
        insurance: 'PAMI',
        price: psychologists[3].consultation_fee,
      },
      {
        date: getRandomDate(18),
        hour: getRandomHour(),
        duration: 45,
        notes: 'Consulta para terapia de ansiedad.',
        patient: patients[9],
        psychologist: psychologists[4] || psychologists[0],
        status: AppointmentStatus.PENDING,
        modality: (psychologists[4] || psychologists[0]).modality,
        session_type: 'Individual',
        therapy_approach: 'TCC',
        insurance: 'OSDE',
        price: (psychologists[4] || psychologists[0]).consultation_fee,
      },

      // Algunas appointments canceladas
      {
        date: getRandomDate(-5),
        hour: getRandomHour(),
        duration: 45,
        notes: 'Cancelada por el paciente.',
        patient: patients[10],
        psychologist: psychologists[0],
        status: AppointmentStatus.CANCELLED,
        modality: psychologists[0].modality,
        session_type: 'Individual',
        therapy_approach: 'TCC',
        insurance: 'Swiss Medical',
        price: psychologists[0].consultation_fee,
      },
      {
        date: getRandomDate(3),
        hour: getRandomHour(),
        duration: 45,
        notes: 'Cancelada por conflicto de horarios.',
        patient: patients[11],
        psychologist: psychologists[1],
        status: AppointmentStatus.CANCELLED,
        modality: psychologists[1].modality,
        session_type: 'Individual',
        therapy_approach: 'Humanística',
        insurance: 'IOMA',
        price: psychologists[1].consultation_fee,
      },

      // Appointments pendientes de aprobación (pagados pero no aprobados)
      {
        date: getRandomDate(5),
        hour: '14:00',
        duration: 45,
        notes: 'Turno pagado - pendiente de aprobación del psicólogo.',
        patient: patients[0],
        psychologist: psychologists[0],
        status: AppointmentStatus.PENDING_APPROVAL,
        modality: psychologists[0].modality,
        session_type: 'Individual',
        therapy_approach: 'TCC',
        insurance: 'OSDE',
        price: psychologists[0].consultation_fee,
      },
      {
        date: getRandomDate(7),
        hour: '15:00',
        duration: 45,
        notes: 'Segunda sesión - pago procesado via MercadoPago.',
        patient: patients[1],
        psychologist: psychologists[1],
        status: AppointmentStatus.PENDING_APPROVAL,
        modality: psychologists[1].modality,
        session_type: 'Individual',
        therapy_approach: 'Humanística',
        insurance: 'Swiss Medical',
        price: psychologists[1].consultation_fee,
      },

      // Más appointments para diversificar
      {
        date: getRandomDate(22),
        hour: getRandomHour(),
        duration: 45,
        notes: 'Sesión de seguimiento mensual.',
        patient: patients[0],
        psychologist: psychologists[0],
        status: AppointmentStatus.CONFIRMED,
        modality: psychologists[0].modality,
        session_type: 'Individual',
        therapy_approach: 'TCC',
        insurance: 'OSDE',
        price: psychologists[0].consultation_fee,
      },
      {
        date: getRandomDate(25),
        hour: getRandomHour(),
        duration: 60,
        notes: 'Terapia de pareja - trabajo en resolución de conflictos.',
        patient: patients[1],
        psychologist: psychologists[2],
        status: AppointmentStatus.PENDING,
        modality: psychologists[2].modality,
        session_type: 'Pareja',
        therapy_approach: 'Terapia de Pareja',
        insurance: 'Swiss Medical',
        price: psychologists[2].consultation_fee,
      },
      {
        date: getRandomDate(30),
        hour: getRandomHour(),
        duration: 45,
        notes: 'Evaluación psicológica integral.',
        patient: patients[2],
        psychologist: psychologists[3],
        status: AppointmentStatus.PENDING,
        modality: psychologists[3].modality,
        session_type: 'Individual',
        therapy_approach: 'Evaluación',
        insurance: 'PAMI',
        price: psychologists[3].consultation_fee,
      },
    ];

    await this.appointmentRepository.save(appointments);
    if (envs.server.environment !== 'production') {
      console.log('✅ Citas precargadas exitosamente');
    }
  }

  async seedPayments() {
    // Buscar appointments que tienen estado pending_approval para crear pagos
    const appointmentsWithPendingApproval = await this.appointmentRepository.find({
      where: { status: AppointmentStatus.PENDING_APPROVAL },
      relations: ['patient']
    });

    const payments = appointmentsWithPendingApproval.map(appointment => {
      return this.paymentRepository.create({
        appointment_id: appointment.id,
        user_id: appointment.patient.id,
        amount: appointment.price || 5000,
        currency: 'ARS',
        pay_method: PayMethod.MERCADO_PAGO,
        pay_status: PayStatus.COMPLETED,
        mercado_pago_id: `test_${appointment.id.slice(-8)}`,
        preference_id: `pref_${appointment.id.slice(-8)}`,
        payer_email: appointment.patient.email,
        notes: 'Pago de prueba procesado via MercadoPago - Seeder'
      });
    });

    if (payments.length > 0) {
      await this.paymentRepository.save(payments);
      if (envs.server.environment !== 'production') {
        console.log(`✅ ${payments.length} Pagos precargados exitosamente para citas pendientes de aprobación`);
      }
    }
  }
}
