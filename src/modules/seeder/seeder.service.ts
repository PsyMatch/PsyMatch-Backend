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
import { envs } from 'src/configs/envs.config';
import { EModality } from '../psychologist/enums/modality.enum';
import { EInsurance } from '../users/enums/insurance_accepted .enum';
import { ELanguages } from '../psychologist/enums/languages.enum';
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
        name: 'Admin User',
        email: 'admin@psymatch.com',
        password: await hashPassword('Abcd1234!'),
        dni: 12345678,
        address: 'Calle Falsa 123, Buenos Aires',
        phone: '+5411111222333',
        birthdate: '1978-06-15',
        health_insurance: EInsurance.OSDE,
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
        email: 'juan.perez@email.com',
        password: await hashPassword('SecurePass123!'),
        dni: 12345679,
        address: 'Av. Corrientes 1234, Buenos Aires',
        phone: '+5411123456789',
        birthdate: '1990-05-15',
        health_insurance: EInsurance.SWISSMEDICAL,
        role: ERole.PATIENT,
      },
      {
        name: 'María González',
        email: 'maria.gonzalez@email.com',
        password: await hashPassword('SecurePass123!'),
        dni: 12345680,
        address: 'Calle Falsa 123, Rosario',
        phone: '+5411987654321',
        birthdate: '1985-08-22',
        health_insurance: EInsurance.IOMA,
        role: ERole.PATIENT,
      },
      {
        name: 'Pedro Rodríguez',
        email: 'pedro.rodriguez@email.com',
        password: await hashPassword('SecurePass123!'),
        dni: 12345681,
        address: 'San Martín 456, Córdoba',
        phone: '+5411777555333',
        birthdate: '1992-12-10',
        health_insurance: EInsurance.PAMI,
        role: ERole.PATIENT,
      },
      {
        name: 'Ana López',
        email: 'ana.lopez@email.com',
        password: await hashPassword('SecurePass123!'),
        dni: 12345682,
        address: 'Rivadavia 789, La Plata',
        phone: '+5411444555666',
        birthdate: '1988-07-03',
        health_insurance: EInsurance.OSDE,
        role: ERole.PATIENT,
      },
      {
        name: 'Carlos Martínez',
        email: 'carlos.martinez@email.com',
        password: await hashPassword('SecurePass123!'),
        dni: 12345683,
        address: 'Belgrano 321, Mendoza',
        phone: '+5411333444555',
        birthdate: '1995-03-28',
        health_insurance: EInsurance.SANCORSALUD,
        role: ERole.PATIENT,
      },
      {
        name: 'Laura Fernández',
        email: 'laura.fernandez@email.com',
        password: await hashPassword('SecurePass123!'),
        dni: 12345684,
        address: 'Mitre 654, Tucumán',
        phone: '+5411888999000',
        birthdate: '1987-11-17',
        health_insurance: EInsurance.UNIONPERSONAL,
        role: ERole.PATIENT,
      },
    ];

    await this.patientRepository.upsert(patients, ['email']);
    if (envs.server.environment !== 'production') {
      console.log('✅ Patients seeded successfully');
    }

    const psychologists = [
      {
        name: 'Dr. Ana García',
        email: 'ana.garcia@psychologist.com',
        password: await hashPassword('SecurePass123!'),
        dni: 87654321,
        address: 'Av. Callao 1000, Buenos Aires',
        phone: '+5411777888999',
        birthdate: '1980-10-10',
        role: ERole.PSYCHOLOGIST,
        personal_biography:
          'Experienced psychologist specializing in cognitive behavioral therapy and grief counseling with over 15 years of practice.',
        professional_experience: 15,
        languages: [ELanguages.SPANISH, ELanguages.ENGLISH],
        office_address: 'Consultorio en Av. Callao 1000, Piso 5',
        modality: EModality.IN_PERSON,
        license_number: 123456,
        specialities: [
          EPsychologistSpecialty.ANGER_MANAGEMENT,
          EPsychologistSpecialty.GRIEF_LOSS,
        ],
        insurance_accepted: [
          EInsurance.OSDE,
          EInsurance.SWISSMEDICAL,
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
      },
      {
        name: 'Dr. Roberto Silva',
        email: 'roberto.silva@psychologist.com',
        password: await hashPassword('SecurePass123!'),
        dni: 87654322,
        address: 'Santa Fe 2000, Buenos Aires',
        phone: '+5411666777888',
        birthdate: '1975-03-15',
        role: ERole.PSYCHOLOGIST,
        personal_biography:
          'Family therapist and sleep disorders specialist with extensive experience in group therapy sessions.',
        professional_experience: 20,
        languages: [ELanguages.SPANISH],
        office_address: 'Consultorio en Santa Fe 2000, Oficina 203',
        modality: EModality.HYBRID,
        license_number: 234567,
        specialities: [
          EPsychologistSpecialty.SLEEP_DISORDERS,
          EPsychologistSpecialty.FAMILY_THERAPY,
        ],
        insurance_accepted: [
          EInsurance.SWISSMEDICAL,
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
      },
      {
        name: 'Dra. Carmen Ruiz',
        email: 'carmen.ruiz@psychologist.com',
        password: await hashPassword('SecurePass123!'),
        dni: 87654323,
        address: 'Pueyrredón 1500, Buenos Aires',
        phone: '+5411555666777',
        birthdate: '1982-07-22',
        role: ERole.PSYCHOLOGIST,
        personal_biography:
          'Child and adolescent therapist with expertise in play therapy and family counseling.',
        professional_experience: 8,
        languages: [ELanguages.SPANISH, ELanguages.PORTUGUESE],
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
          EInsurance.UNIONPERSONAL,
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
      },
    ];

    await this.psychologistRepository.upsert(psychologists, ['email']);
    if (envs.server.environment !== 'production') {
      console.log('✅ Psychologists seeded successfully');
    }
  }
}
