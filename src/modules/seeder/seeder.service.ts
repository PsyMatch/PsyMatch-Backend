import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { Patient } from '../users/entities/patient.entity';
import { Admin } from '../users/entities/admin.entity';
import { Psychologist } from '../psychologist/entities/psychologist.entity';
import { ERole } from '../../common/enums/role.enum';
import { PsychologistSpecialty } from '../psychologist/enums/specialities.enum';
import { PsychologistStatus } from '../psychologist/enums/verified.enum';

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

    const adminUser = {
      name: 'Franco Gauna',
      email: 'francorgauna@gmail.com',
      password: await hashPassword('SecurePass123!'),
      dni: 12345678,
      social_security_number: '123-45-6789',
      address: 'Pasaje Fazio 1477',
      phone: '+542226482075',
      role: ERole.ADMIN,
    };

    await this.adminRepository.upsert([adminUser], ['email']);
    console.log('✅ Admin seeded successfully');

    const patients = [
      {
        name: 'Juan Carlos Pérez',
        email: 'juan.perez@email.com',
        password: await hashPassword('SecurePass123!'),
        dni: 12345679,
        social_security_number: '123-45-6790',
        address: 'Av. Corrientes 1234, Buenos Aires',
        phone: '+5411123456789',
        birthdate: '15-05-1990',
        role: ERole.PATIENT,
      },
      {
        name: 'María González',
        email: 'maria.gonzalez@email.com',
        password: await hashPassword('SecurePass123!'),
        dni: 12345680,
        social_security_number: '123-45-6791',
        address: 'Calle Falsa 123, Rosario',
        phone: '+5411987654321',
        birthdate: '22-08-1985',
        role: ERole.PATIENT,
      },
      {
        name: 'Pedro Rodríguez',
        email: 'pedro.rodriguez@email.com',
        password: await hashPassword('SecurePass123!'),
        dni: 12345681,
        social_security_number: '123-45-6792',
        address: 'San Martín 456, Córdoba',
        phone: '+5411777555333',
        birthdate: '10-12-1992',
        role: ERole.PATIENT,
      },
      {
        name: 'Ana López',
        email: 'ana.lopez@email.com',
        password: await hashPassword('SecurePass123!'),
        dni: 12345682,
        social_security_number: '123-45-6793',
        address: 'Rivadavia 789, La Plata',
        phone: '+5411444555666',
        birthdate: '03-07-1988',
        role: ERole.PATIENT,
      },
      {
        name: 'Carlos Martínez',
        email: 'carlos.martinez@email.com',
        password: await hashPassword('SecurePass123!'),
        dni: 12345683,
        social_security_number: '123-45-6794',
        address: 'Belgrano 321, Mendoza',
        phone: '+5411333444555',
        birthdate: '28-03-1995',
        role: ERole.PATIENT,
      },
      {
        name: 'Laura Fernández',
        email: 'laura.fernandez@email.com',
        password: await hashPassword('SecurePass123!'),
        dni: 12345684,
        social_security_number: '123-45-6795',
        address: 'Mitre 654, Tucumán',
        phone: '+5411222333444',
        birthdate: '17-11-1987',
        role: ERole.PATIENT,
      },
    ];

    await this.patientRepository.upsert(patients, ['email']);
    console.log('✅ Patients seeded successfully');

    const psychologists = [
      {
        name: 'Dr. Ana García',
        email: 'ana.garcia@psychologist.com',
        password: await hashPassword('SecurePass123!'),
        dni: 87654321,
        social_security_number: '987-65-4321',
        address: 'Av. Callao 1000, Buenos Aires',
        phone: '+5411777888999',
        role: ERole.PSYCHOLOGIST,
        office_address: 'Consultorio en Av. Callao 1000, Piso 5',
        license_number: 'PSI-12345',
        specialities: [
          PsychologistSpecialty.CLINICAL,
          PsychologistSpecialty.COUNSELING,
        ],
        verified: PsychologistStatus.VALIDATED,
      },
      {
        name: 'Dr. Roberto Silva',
        email: 'roberto.silva@psychologist.com',
        password: await hashPassword('SecurePass123!'),
        dni: 87654322,
        social_security_number: '987-65-4322',
        address: 'Santa Fe 2000, Buenos Aires',
        phone: '+5411666777888',
        role: ERole.PSYCHOLOGIST,
        office_address: 'Consultorio en Santa Fe 2000, Oficina 203',
        license_number: 'PSI-12346',
        specialities: [
          PsychologistSpecialty.TRAUMA,
          PsychologistSpecialty.ADDICTION,
        ],
        verified: PsychologistStatus.VALIDATED,
      },
      {
        name: 'Dra. Carmen Ruiz',
        email: 'carmen.ruiz@psychologist.com',
        password: await hashPassword('SecurePass123!'),
        dni: 87654323,
        social_security_number: '987-65-4323',
        address: 'Pueyrredón 1500, Buenos Aires',
        phone: '+5411555666777',
        role: ERole.PSYCHOLOGIST,
        office_address: 'Consultorio en Pueyrredón 1500, Suite 15',
        license_number: 'PSI-12347',
        specialities: [
          PsychologistSpecialty.CHILD,
          PsychologistSpecialty.FAMILY,
        ],
        verified: PsychologistStatus.PENDING,
      },
    ];

    await this.psychologistRepository.upsert(psychologists, ['email']);
    console.log('✅ Psychologists seeded successfully');
  }
}
