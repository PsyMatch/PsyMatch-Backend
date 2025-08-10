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
        social_security_number: '123-45-6788',
        address: 'Calle Falsa 123, Buenos Aires',
        phone: '+5411222333444',
        birthdate: new Date('1980-01-01'),
        role: ERole.ADMIN,
        verified: null,
      },
      {
        name: 'Franco Gauna',
        email: 'francorgauna@gmail.com',
        password: await hashPassword('SecurePass123!'),
        dni: 43394021,
        social_security_number: '123-45-6789',
        address: 'Pasaje Fazio 1477',
        phone: '+542226482075',
        birthdate: new Date('1980-01-01'),
        role: ERole.ADMIN,
        verified: null,
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
        social_security_number: '123-45-6790',
        address: 'Av. Corrientes 1234, Buenos Aires',
        phone: '+5411123456789',
        birthdate: new Date('1990-05-15'),
        role: ERole.PATIENT,
        verified: null,
      },
      {
        name: 'María González',
        email: 'maria.gonzalez@email.com',
        password: await hashPassword('SecurePass123!'),
        dni: 12345680,
        social_security_number: '123-45-6791',
        address: 'Calle Falsa 123, Rosario',
        phone: '+5411987654321',
        birthdate: new Date('1985-08-22'),
        role: ERole.PATIENT,
        verified: null,
      },
      {
        name: 'Pedro Rodríguez',
        email: 'pedro.rodriguez@email.com',
        password: await hashPassword('SecurePass123!'),
        dni: 12345681,
        social_security_number: '123-45-6792',
        address: 'San Martín 456, Córdoba',
        phone: '+5411777555333',
        birthdate: new Date('1992-12-10'),
        role: ERole.PATIENT,
        verified: null,
      },
      {
        name: 'Ana López',
        email: 'ana.lopez@email.com',
        password: await hashPassword('SecurePass123!'),
        dni: 12345682,
        social_security_number: '123-45-6793',
        address: 'Rivadavia 789, La Plata',
        phone: '+5411444555666',
        birthdate: new Date('1988-07-03'),
        role: ERole.PATIENT,
        verified: null,
      },
      {
        name: 'Carlos Martínez',
        email: 'carlos.martinez@email.com',
        password: await hashPassword('SecurePass123!'),
        dni: 12345683,
        social_security_number: '123-45-6794',
        address: 'Belgrano 321, Mendoza',
        phone: '+5411333444555',
        birthdate: new Date('1995-03-28'),
        role: ERole.PATIENT,
        verified: null,
      },
      {
        name: 'Laura Fernández',
        email: 'laura.fernandez@email.com',
        password: await hashPassword('SecurePass123!'),
        dni: 12345684,
        social_security_number: '123-45-6795',
        address: 'Mitre 654, Tucumán',
        phone: '+5411222333444',
        birthdate: new Date('1987-11-17'),
        role: ERole.PATIENT,
        verified: null,
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
        social_security_number: '987-65-4321',
        address: 'Av. Callao 1000, Buenos Aires',
        phone: '+5411777888999',
        birthdate: new Date('1980-10-10'),
        role: ERole.PSYCHOLOGIST,
        office_address: 'Consultorio en Av. Callao 1000, Piso 5',
        license_number: 'PSI-12345',
        specialities: [
          EPsychologistSpecialty.ANGER_MANAGEMENT,
          EPsychologistSpecialty.GRIEF_LOSS,
        ],
        session_types: [ESessionType.INDIVIDUAL, ESessionType.COUPLE],
        therapy_approaches: [
          ETherapyApproach.COGNITIVE_BEHAVIORAL_THERAPY,
          ETherapyApproach.PSYCHODYNAMIC_THERAPY,
        ],
        verified: EPsychologistStatus.VALIDATED,
      },
      {
        name: 'Dr. Roberto Silva',
        email: 'roberto.silva@psychologist.com',
        password: await hashPassword('SecurePass123!'),
        dni: 87654322,
        social_security_number: '987-65-4322',
        address: 'Santa Fe 2000, Buenos Aires',
        phone: '+5411666777888',
        birthdate: new Date('1975-03-15'),
        role: ERole.PSYCHOLOGIST,
        office_address: 'Consultorio en Santa Fe 2000, Oficina 203',
        license_number: 'PSI-12346',
        specialities: [
          EPsychologistSpecialty.SLEEP_DISORDERS,
          EPsychologistSpecialty.FAMILY_THERAPY,
        ],
        session_types: [ESessionType.FAMILY, ESessionType.GROUP],
        therapy_approaches: [
          ETherapyApproach.FAMILY_SYSTEMS_THERAPY,
          ETherapyApproach.GROUP_THERAPY,
        ],
        verified: EPsychologistStatus.VALIDATED,
      },
      {
        name: 'Dra. Carmen Ruiz',
        email: 'carmen.ruiz@psychologist.com',
        password: await hashPassword('SecurePass123!'),
        dni: 87654323,
        social_security_number: '987-65-4323',
        address: 'Pueyrredón 1500, Buenos Aires',
        phone: '+5411555666777',
        birthdate: '22-07-1982',
        role: ERole.PSYCHOLOGIST,
        office_address: 'Consultorio en Pueyrredón 1500, Suite 15',
        license_number: 'PSI-12347',
        specialities: [
          EPsychologistSpecialty.CHILD_ADOLESCENT_THERAPY,
          EPsychologistSpecialty.FAMILY_THERAPY,
        ],
        session_types: [ESessionType.INDIVIDUAL, ESessionType.FAMILY],
        therapy_approaches: [
          ETherapyApproach.PLAY_THERAPY,
          ETherapyApproach.SOLUTION_FOCUSED_BRIEF_THERAPY,
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
