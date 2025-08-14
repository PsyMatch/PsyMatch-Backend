# Módulo de Seeder (Datos de Prueba)

## Descripción General

El módulo de **Seeder** proporciona datos de prueba y configuración inicial para el desarrollo y testing de PsyMatch. Permite poblar la base de datos con información realista de usuarios, psicólogos y administradores, facilitando el desarrollo, testing y demos de la aplicación. Es una herramienta esencial para mantener consistencia en los entornos de desarrollo y staging.

## Funcionalidades Principales

### 🌱 Poblado de Base de Datos

- **Datos realistas**: Información de usuarios, psicólogos y administradores con datos coherentes
- **Diversidad de casos**: Variedad de especialidades, modalidades y configuraciones
- **Relaciones consistentes**: Datos que respetan las reglas de negocio y relaciones
- **Entornos específicos**: Diferentes configuraciones para desarrollo, testing y producción

### 👥 Tipos de Usuarios Creados

- **Administradores**: Usuarios con permisos completos para gestión
- **Pacientes**: Usuarios finales con diferentes perfiles demográficos
- **Psicólogos**: Profesionales con diversas especialidades y estados de verificación
- **Configuraciones variadas**: Diferentes combinaciones de servicios y características

### 🔧 Configuración Automática

- **Contraseñas seguras**: Hash automático de contraseñas con bcrypt
- **Estados de verificación**: Psicólogos en diferentes estados (pendiente, validado, rechazado)
- **Datos geográficos**: Coordenadas y direcciones de diferentes ciudades argentinas
- **Seguros médicos**: Variedad de obras sociales y seguros

## Estructura del Módulo

```
seeder/
├── seeder.module.ts        # Configuración y auto-ejecución del módulo
└── seeder.service.ts       # Lógica de creación de datos de prueba
```

## Configuración del Módulo

### 📦 SeederModule

```typescript
@Module({
  imports: [TypeOrmModule.forFeature([Patient, Admin, Psychologist])],
  providers: [SeederService],
})
export class SeederModule implements OnModuleInit {
  constructor(private readonly seederService: SeederService) {}

  async onModuleInit() {
    await this.seederService.seedUsers();
  }
}
```

**Características**:

- **Auto-ejecución**: Se ejecuta automáticamente al inicializar el módulo
- **Upsert seguro**: Evita duplicados usando `upsert` por email
- **Conditional logging**: Solo muestra logs en entornos no productivos

## Datos Generados

### 👑 Administradores

#### Admin Principal

```typescript
{
  name: 'Admin User',
  email: 'psymatch.contact@gmail.com',
  password: 'Elmejorteam4!', // Hasheada con bcrypt
  role: ERole.ADMIN
}
```

**Características**:

- Email corporativo de PsyMatch
- Contraseña segura pre-establecida
- Permisos completos de administración

### 👤 Pacientes (12 usuarios de prueba)

#### Ejemplos de Pacientes

```typescript
// Paciente con ubicación en Buenos Aires
{
  name: 'Juan Carlos Pérez',
  email: 'juan.perez@email.com',
  dni: 12345679,
  address: 'Av. Corrientes 1234, Buenos Aires',
  phone: '+5411123456789',
  birthdate: '1990-05-15',
  health_insurance: EInsurance.SWISS_MEDICAL,
  emergency_contact: 'María Pérez - +5411987654321 - Madre',
  latitude: -34.6037,
  longitude: -58.3816,
  profile_picture: 'https://example.com/profile/juan-perez.jpg'
}

// Paciente de Córdoba
{
  name: 'Pedro Rodríguez',
  email: 'pedro.rodriguez@email.com',
  dni: 12345681,
  address: 'San Martín 456, Córdoba',
  phone: '+5411777555333',
  birthdate: '1992-12-10',
  health_insurance: EInsurance.PAMI,
  latitude: -31.4167,
  longitude: -64.1833
}
```

**Diversidad de Datos**:

- **Ubicaciones**: Buenos Aires, Córdoba, Rosario, La Plata, Mendoza, Tucumán, etc.
- **Obras Sociales**: OSDE, Swiss Medical, IOMA, PAMI, Sancor Salud, etc.
- **Edades**: Rango de 25 a 40 años aproximadamente
- **Contactos de emergencia**: Algunos con información completa

### 👨‍⚕️ Psicólogos (10 profesionales)

#### Ejemplos de Psicólogos

```typescript
// Psicólogo validado - Presencial
{
  name: 'Dr. Ana García',
  email: 'ana.garcia@psychologist.com',
  dni: 87654321,
  address: 'Av. Callao 1000, Buenos Aires',
  phone: '+5411777888999',
  birthdate: '1980-10-10',
  personal_biography: 'Experienced psychologist specializing in cognitive behavioral therapy and grief counseling with over 15 years of practice.',
  professional_experience: 15,
  languages: [ELanguage.SPANISH, ELanguage.ENGLISH],
  office_address: 'Consultorio en Av. Callao 1000, Piso 5',
  modality: EModality.IN_PERSON,
  license_number: 123456,
  specialities: [
    EPsychologistSpecialty.ANGER_MANAGEMENT,
    EPsychologistSpecialty.GRIEF_LOSS
  ],
  insurance_accepted: [
    EInsurance.OSDE,
    EInsurance.SWISS_MEDICAL,
    EInsurance.IOMA
  ],
  session_types: [ESessionType.INDIVIDUAL, ESessionType.COUPLE],
  therapy_approaches: [
    ETherapyApproach.COGNITIVE_BEHAVIORAL_THERAPY,
    ETherapyApproach.PSYCHODYNAMIC_THERAPY
  ],
  availability: [
    EAvailability.MONDAY,
    EAvailability.TUESDAY,
    EAvailability.WEDNESDAY,
    EAvailability.THURSDAY,
    EAvailability.FRIDAY
  ],
  verified: EPsychologistStatus.VALIDATED
}

// Psicólogo pendiente - Online
{
  name: 'Dra. Carmen Ruiz',
  email: 'carmen.ruiz@psychologist.com',
  personal_biography: 'Child and adolescent therapist with expertise in play therapy and family counseling.',
  professional_experience: 8,
  languages: [ELanguage.SPANISH, ELanguage.PORTUGUESE],
  office_address: 'Consultorio virtual - Modalidad Online',
  modality: EModality.ONLINE,
  license_number: 345678,
  specialities: [
    EPsychologistSpecialty.CHILD_ADOLESCENT_THERAPY,
    EPsychologistSpecialty.FAMILY_THERAPY
  ],
  therapy_approaches: [
    ETherapyApproach.PLAY_THERAPY,
    ETherapyApproach.SOLUTION_FOCUSED_BRIEF_THERAPY
  ],
  verified: EPsychologistStatus.PENDING
}
```

**Diversidad Profesional**:

- **Estados de verificación**: 60% validados, 40% pendientes
- **Modalidades**: Presencial, online, híbrida
- **Especialidades**: Todas las especialidades disponibles representadas
- **Experiencia**: Rango de 7 a 20 años de experiencia
- **Idiomas**: Español, inglés, portugués
- **Ubicaciones**: Diferentes provincias argentinas

### 📊 Distribución de Especialidades

```typescript
const specialtyDistribution = {
  // Más comunes
  ANXIETY_DISORDER: 3,
  DEPRESSION: 2,
  COUPLES_THERAPY: 2,
  FAMILY_THERAPY: 3,

  // Especializadas
  CHILD_ADOLESCENT_THERAPY: 1,
  TRAUMA_PTSD: 1,
  ADDICTION_SUBSTANCE_ABUSE: 1,
  EATING_DISORDER: 1,
  BIPOLAR_DISORDER: 1,
  AUTISM_SPECTRUM_DISORDER: 1,

  // Específicas
  SLEEP_DISORDERS: 1,
  ANGER_MANAGEMENT: 1,
  GRIEF_LOSS: 1,
  CAREER_COUNSELING: 1,
  GERIATRIC_PS: 1,
  LGBTQIA: 1,
  CHRONIC_PAIN_MANAGEMENT: 1,
};
```

### 🏥 Distribución de Obras Sociales

```typescript
const insuranceDistribution = {
  OSDE: 4,
  SWISS_MEDICAL: 4,
  IOMA: 6,
  PAMI: 4,
  SANCOR_SALUD: 2,
  UNION_PERSONAL: 3,
  OSDEPYM: 2,
  LUIS_PASTEUR: 1,
  JERARQUICOS_SALUD: 1,
  OSECAC: 2,
  OSMECON_SALUD: 1,
  APROSS: 2,
  OSPRERA: 1,
  OSPIP: 1,
  OSPAT: 1,
};
```

## Integración y Uso

### 🚀 Ejecución Automática

El seeder se ejecuta automáticamente cuando se inicia la aplicación:

```typescript
// En app.module.ts
@Module({
  imports: [
    // Otros módulos...
    SeederModule, // Se ejecuta automáticamente
  ],
})
export class AppModule {}
```

### 🔧 Ejecución Manual

```typescript
// Para ejecutar el seeder manualmente
import { SeederService } from './modules/seeder/seeder.service';

async function runSeeder() {
  const seederService = new SeederService(
    patientRepository,
    adminRepository,
    psychologistRepository,
  );

  await seederService.seedUsers();
  console.log('Seeder executed successfully');
}
```

### 🛠️ Scripts de NPM

```json
{
  "scripts": {
    "seed": "nest start --entryFile=seeder",
    "seed:fresh": "npm run db:reset && npm run seed",
    "db:reset": "npm run typeorm schema:drop && npm run typeorm migration:run"
  }
}
```

## Configuración por Entornos

### 🌍 Configuración de Entorno

```typescript
// En seeder.service.ts
if (envs.server.environment !== 'production') {
  console.log('✅ Admin seeded successfully');
  console.log('✅ Patients seeded successfully');
  console.log('✅ Psychologists seeded successfully');
}
```

### 📋 Variables de Entorno

```env
# .env.development
NODE_ENV=development
SEED_ON_START=true
SEED_ADMIN_PASSWORD=Elmejorteam4!

# .env.production
NODE_ENV=production
SEED_ON_START=false
```

### 🔄 Configuración Condicional

```typescript
// Configuración avanzada del seeder
export class SeederService {
  private readonly isDevelopment = envs.server.environment === 'development';
  private readonly isProduction = envs.server.environment === 'production';

  async seedUsers() {
    // Siempre crear admin principal
    await this.seedAdmin();

    if (!this.isProduction) {
      // Solo en desarrollo crear datos de prueba
      await this.seedPatients();
      await this.seedPsychologists();
    }
  }
}
```

## Testing y Validación

### 🧪 Scripts de Validación

```typescript
// utils/validate-seeder.ts
export async function validateSeederData() {
  const adminCount = await adminRepository.count();
  const patientCount = await patientRepository.count();
  const psychologistCount = await psychologistRepository.count();

  console.log(`
    📊 Seeder Validation Results:
    👑 Admins: ${adminCount}
    👤 Patients: ${patientCount}
    👨‍⚕️ Psychologists: ${psychologistCount}
    
    ✅ Expected: 1 admin, 12 patients, 10 psychologists
    ${adminCount === 1 && patientCount === 12 && psychologistCount === 10 ? '✅ PASSED' : '❌ FAILED'}
  `);
}
```

### 🔍 Verificación de Integridad

```typescript
// utils/integrity-check.ts
export async function checkDataIntegrity() {
  // Verificar que todos los emails son únicos
  const duplicateEmails = await userRepository
    .createQueryBuilder('user')
    .select('user.email')
    .groupBy('user.email')
    .having('COUNT(user.email) > 1')
    .getRawMany();

  if (duplicateEmails.length > 0) {
    throw new Error(
      `Duplicate emails found: ${duplicateEmails.map((e) => e.email).join(', ')}`,
    );
  }

  // Verificar que todas las contraseñas están hasheadas
  const users = await userRepository.find();
  const unhashed = users.filter((u) => !u.password.startsWith('$2b$'));

  if (unhashed.length > 0) {
    throw new Error(
      `Unhashed passwords found for users: ${unhashed.map((u) => u.email).join(', ')}`,
    );
  }

  console.log('✅ Data integrity check passed');
}
```

## Extensión del Seeder

### 📈 Agregar Nuevos Tipos de Datos

```typescript
// Extensión para agregar citas de ejemplo
async seedAppointments() {
  const patients = await this.patientRepository.find();
  const psychologists = await this.psychologistRepository.find({
    where: { verified: EPsychologistStatus.VALIDATED }
  });

  const sampleAppointments = [];

  for (let i = 0; i < 20; i++) {
    const randomPatient = patients[Math.floor(Math.random() * patients.length)];
    const randomPsychologist = psychologists[Math.floor(Math.random() * psychologists.length)];

    sampleAppointments.push({
      patient: randomPatient,
      psychologist: randomPsychologist,
      date: this.getRandomFutureDate(),
      status: this.getRandomAppointmentStatus(),
      notes: 'Cita de ejemplo generada por seeder'
    });
  }

  await this.appointmentRepository.save(sampleAppointments);
  console.log('✅ Sample appointments seeded');
}

private getRandomFutureDate(): Date {
  const now = new Date();
  const futureDate = new Date(now.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000);
  return futureDate;
}
```

### 🔄 Seeder Incremental

```typescript
// Seeder que no sobrescribe datos existentes
async seedIncremental() {
  const existingAdminCount = await this.adminRepository.count();

  if (existingAdminCount === 0) {
    await this.seedAdmin();
    console.log('✅ Admin seeded');
  } else {
    console.log('ℹ️ Admin already exists, skipping');
  }

  const existingPatientCount = await this.patientRepository.count();

  if (existingPatientCount < 5) {
    await this.seedPatients();
    console.log('✅ Patients seeded');
  } else {
    console.log('ℹ️ Sufficient patients exist, skipping');
  }
}
```

### 🎲 Datos Aleatorios

```typescript
// Generador de datos aleatorios
export class RandomDataGenerator {
  private readonly argentinianNames = [
    'Juan',
    'María',
    'Carlos',
    'Ana',
    'Pedro',
    'Sofía',
    'Roberto',
    'Carmen',
  ];

  private readonly argentinianSurnames = [
    'García',
    'Rodríguez',
    'González',
    'Fernández',
    'López',
    'Martínez',
  ];

  private readonly argentinianCities = [
    { name: 'Buenos Aires', lat: -34.6037, lng: -58.3816 },
    { name: 'Córdoba', lat: -31.4167, lng: -64.1833 },
    { name: 'Rosario', lat: -32.9442, lng: -60.6505 },
  ];

  generateRandomPatient(): Partial<Patient> {
    const name = this.getRandomName();
    const city = this.getRandomCity();

    return {
      name: name,
      email: this.generateEmail(name),
      dni: this.generateRandomDNI(),
      address: this.generateAddress(city.name),
      phone: this.generatePhoneNumber(),
      birthdate: this.generateRandomBirthdate(),
      health_insurance: this.getRandomInsurance(),
      latitude: city.lat,
      longitude: city.lng,
    };
  }

  private getRandomName(): string {
    const firstName =
      this.argentinianNames[
        Math.floor(Math.random() * this.argentinianNames.length)
      ];
    const lastName =
      this.argentinianSurnames[
        Math.floor(Math.random() * this.argentinianSurnames.length)
      ];
    return `${firstName} ${lastName}`;
  }

  private generateEmail(name: string): string {
    const cleanName = name.toLowerCase().replace(/\s+/g, '.');
    return `${cleanName}@email.com`;
  }

  private generateRandomDNI(): number {
    return Math.floor(Math.random() * 90000000) + 10000000;
  }
}
```

## Comandos CLI para Seeder

### 🖥️ Interfaz de Línea de Comandos

```typescript
// cli/seeder.cli.ts
import { Command } from 'commander';
import { SeederService } from '../modules/seeder/seeder.service';

const program = new Command();

program
  .name('psymatch-seeder')
  .description('PsyMatch Database Seeder CLI')
  .version('1.0.0');

program
  .command('seed')
  .description('Run full database seeding')
  .option('-e, --env <environment>', 'environment', 'development')
  .option('--admin-only', 'seed only admin user')
  .option('--patients-only', 'seed only patients')
  .option('--psychologists-only', 'seed only psychologists')
  .action(async (options) => {
    const seederService = new SeederService();

    if (options.adminOnly) {
      await seederService.seedAdmin();
    } else if (options.patientsOnly) {
      await seederService.seedPatients();
    } else if (options.psychologistsOnly) {
      await seederService.seedPsychologists();
    } else {
      await seederService.seedUsers();
    }

    console.log('✅ Seeding completed successfully');
  });

program
  .command('validate')
  .description('Validate seeded data integrity')
  .action(async () => {
    await validateSeederData();
    await checkDataIntegrity();
  });

program
  .command('clean')
  .description('Clean all seeded data')
  .option('--confirm', 'confirm deletion')
  .action(async (options) => {
    if (!options.confirm) {
      console.log('❌ Use --confirm flag to proceed with data deletion');
      return;
    }

    await cleanSeededData();
    console.log('✅ Seeded data cleaned successfully');
  });

program.parse();
```

### 📦 Package.json Scripts

```json
{
  "scripts": {
    "seed": "ts-node cli/seeder.cli.ts seed",
    "seed:admin": "ts-node cli/seeder.cli.ts seed --admin-only",
    "seed:patients": "ts-node cli/seeder.cli.ts seed --patients-only",
    "seed:psychologists": "ts-node cli/seeder.cli.ts seed --psychologists-only",
    "seed:validate": "ts-node cli/seeder.cli.ts validate",
    "seed:clean": "ts-node cli/seeder.cli.ts clean --confirm",
    "seed:fresh": "npm run seed:clean && npm run seed"
  }
}
```

## Mejores Prácticas

### ✅ Recomendaciones

1. **Upsert Safety**: Siempre usar `upsert` para evitar duplicados
2. **Environment Checks**: No ejecutar en producción automáticamente
3. **Password Security**: Siempre hashear contraseñas
4. **Data Consistency**: Mantener relaciones coherentes
5. **Logging Conditional**: Solo mostrar logs en desarrollo

### 🚫 Qué Evitar

1. **Hardcoded Passwords**: Usar variables de entorno
2. **Production Seeding**: No sobrescribir datos reales
3. **Weak Passwords**: Usar contraseñas seguras
4. **Inconsistent Data**: Verificar integridad referencial
5. **Memory Leaks**: Limpiar recursos después del seeding

## Consideraciones de Seguridad

### 🔐 Seguridad de Datos

```typescript
// Configuración segura para diferentes entornos
const getSecurePassword = (env: string): string => {
  if (env === 'production') {
    return process.env.ADMIN_DEFAULT_PASSWORD || 'GeneratedSecurePassword!';
  }
  return 'DevPassword123!'; // Solo para desarrollo
};

// Validación de entorno antes de seeding
const validateEnvironment = (): void => {
  if (
    process.env.NODE_ENV === 'production' &&
    process.env.ALLOW_PRODUCTION_SEEDING !== 'true'
  ) {
    throw new Error('Production seeding is disabled for security');
  }
};
```

### 🛡️ Protección de Datos Sensibles

```typescript
// Anonimización de datos sensibles
const anonymizeForDemo = (data: any): any => {
  return {
    ...data,
    email: `demo.user.${Math.random().toString(36).substring(7)}@psymatch.demo`,
    phone: '+541100000000',
    dni: Math.floor(Math.random() * 90000000) + 10000000,
  };
};
```

## Monitoreo y Métricas

### 📊 Métricas del Seeder

```typescript
interface SeederMetrics {
  executionTime: number;
  recordsCreated: {
    admins: number;
    patients: number;
    psychologists: number;
  };
  errors: string[];
  environment: string;
  timestamp: Date;
}

class SeederMonitor {
  static async trackExecution(
    operation: () => Promise<void>,
  ): Promise<SeederMetrics> {
    const startTime = Date.now();
    const errors: string[] = [];

    try {
      await operation();
    } catch (error) {
      errors.push(error.message);
    }

    const endTime = Date.now();

    return {
      executionTime: endTime - startTime,
      recordsCreated: await this.countRecords(),
      errors,
      environment: process.env.NODE_ENV,
      timestamp: new Date(),
    };
  }
}
```

## Próximas Mejoras

- [ ] Seeder de citas y pagos de ejemplo
- [ ] Generación de reseñas realistas
- [ ] Datos de prueba para diferentes timezone
- [ ] Seeder para datos de testing automatizado
- [ ] Integración con factories de datos
- [ ] Seeder incremental inteligente
- [ ] Backup automático antes de seeding
- [ ] Validación de esquemas con Joi/Yup
- [ ] Métricas y monitoring del seeder
- [ ] Interfaz web para gestión de seeding
