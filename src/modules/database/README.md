# Módulo de Base de Datos (Database)

## Descripción General

El módulo de **Database** es el núcleo de gestión de datos de PsyMatch-Backend. Utiliza **TypeORM** con **PostgreSQL** para proporcionar una capa de persistencia robusta, escalable y tipo-segura. Implementa un patrón de herencia de tabla única (STI) para la gestión de diferentes tipos de usuarios y maneja todas las relaciones entre entidades del sistema.

## Tecnologías Utilizadas

### 🗄️ Base de Datos

- **PostgreSQL 13+**: Base de datos relacional principal
- **TypeORM**: ORM moderno para TypeScript/JavaScript
- **Migrations**: Control de versiones de esquema de BD

### 🏗️ Arquitectura

- **Single Table Inheritance (STI)**: Para usuarios, pacientes y psicólogos
- **Entity Relationships**: Relaciones uno-a-muchos y muchos-a-muchos
- **UUID Primary Keys**: Identificadores únicos seguros
- **Enum Types**: Tipos de datos controlados

## Estructura del Módulo

```
database/
├── database.module.ts          # Configuración principal del módulo
├── migrations/                 # Archivos de migración (futuro)
└── relationships/
    ├── user-patient-psychologist-inheritance.md
    ├── appointments-relationships.md
    └── data-integrity-constraints.md
```

## Configuración de la Base de Datos

### 🔧 Configuración Principal

```typescript
// src/configs/typeorm.config.ts
export const typeorm: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true',
  synchronize: process.env.ENVIRONMENT !== 'production',
  dropSchema: process.env.ENVIRONMENT !== 'production',
  logging: false,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
};
```

### 🌍 Variables de Entorno

```bash
# .env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=psymatch_db
DB_USERNAME=postgres
DB_PASSWORD=your_secure_password
DB_SSL=false

# Para producción
DB_SSL=true
ENVIRONMENT=production
```

## Esquema de Base de Datos

### 👥 Tabla Principal: `users`

**Single Table Inheritance (STI)** - Tabla base para todos los usuarios:

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    phone TEXT,
    birthdate DATE,
    dni BIGINT UNIQUE,
    email TEXT UNIQUE NOT NULL,
    password TEXT,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    profile_picture TEXT,
    role user_role NOT NULL DEFAULT 'Paciente',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    provider TEXT,
    provider_id TEXT,

    -- Campos específicos de Patient
    address TEXT,
    health_insurance insurance_enum,
    emergency_contact TEXT,

    -- Campos específicos de Psychologist
    personal_biography TEXT,
    languages language_enum[],
    professional_experience INTEGER,
    professional_title TEXT,
    license_number BIGINT UNIQUE,
    verified psychologist_status_enum,
    office_address TEXT,
    specialities specialty_enum[],
    therapy_approaches therapy_approach_enum[],
    session_types session_type_enum[],
    modality modality_enum,
    insurance_accepted insurance_enum[],
    availability availability_enum[]
);
```

### 📅 Tabla: `appointments`

```sql
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration INTEGER,
    notes TEXT,
    patient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    psychologist_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status appointment_status DEFAULT 'pending',
    modality modality_enum NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### ⭐ Tabla: `reviews`

```sql
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rating DECIMAL(10,2) NOT NULL,
    comment TEXT NOT NULL,
    review_date DATE NOT NULL,
    psychologist_id UUID REFERENCES users(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES users(id) ON DELETE CASCADE
);
```

### 💳 Tabla: `payments`

```sql
CREATE TABLE payments (
    payment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    pay_method payment_method_enum NOT NULL,
    notes TEXT,
    refund_amount DECIMAL(10,2),
    pay_status payment_status_enum DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 📋 Tabla: `records`

```sql
CREATE TABLE records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    psychologist_id UUID REFERENCES users(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    type record_type_enum DEFAULT 'PERSONAL_NOTE',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Entidades y Relaciones

### 🏛️ Herencia de Entidades

#### Entidad Base: `User`

```typescript
@Entity('users')
@TableInheritance({
  column: { type: 'enum', name: 'role', enum: ERole },
  pattern: 'STI',
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({ type: 'text', unique: true, nullable: false })
  email: string;

  @Column({ type: 'enum', enum: ERole, default: ERole.PATIENT })
  role: ERole;

  // ... más campos comunes
}
```

#### Entidad Hija: `Patient`

```typescript
@ChildEntity(ERole.PATIENT)
export class Patient extends User {
  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'enum', enum: EInsurance, nullable: true })
  health_insurance: EInsurance;

  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  appointments: Appointment[];
}
```

#### Entidad Hija: `Psychologist`

```typescript
@ChildEntity(ERole.PSYCHOLOGIST)
export class Psychologist extends User {
  @Column({ type: 'text', nullable: false })
  personal_biography: string;

  @Column({ type: 'bigint', unique: true, nullable: false })
  license_number: number;

  @Column({ type: 'enum', enum: EPsychologistSpecialty, array: true })
  specialities: EPsychologistSpecialty[];

  @OneToMany(() => Appointment, (appointment) => appointment.psychologist)
  appointments: Appointment[];

  @OneToMany(() => Reviews, (reviews) => reviews.psychologist)
  reviews: Reviews[];
}
```

### 🔗 Relaciones Entre Entidades

#### 1. **Patient ↔ Appointment** (One-to-Many)

```typescript
// Un paciente puede tener múltiples citas
@OneToMany(() => Appointment, (appointment) => appointment.patient)
appointments: Appointment[];

// Cada cita pertenece a un paciente
@ManyToOne(() => Patient, (patient) => patient.appointments)
patient: Patient;
```

#### 2. **Psychologist ↔ Appointment** (One-to-Many)

```typescript
// Un psicólogo puede tener múltiples citas
@OneToMany(() => Appointment, (appointment) => appointment.psychologist)
appointments: Appointment[];

// Cada cita pertenece a un psicólogo
@ManyToOne(() => Psychologist, (psychologist) => psychologist.appointments)
psychologist: Psychologist;
```

#### 3. **Psychologist ↔ Reviews** (One-to-Many)

```typescript
// Un psicólogo puede tener múltiples reseñas
@OneToMany(() => Reviews, (reviews) => reviews.psychologist)
reviews: Reviews[];

// Cada reseña pertenece a un psicólogo
@ManyToOne(() => Psychologist, (psychologist) => psychologist.reviews)
psychologist: Psychologist;
```

#### 4. **Appointment ↔ Payment** (One-to-One)

```typescript
// Cada cita puede tener un pago asociado
@OneToOne(() => Payment, (payment) => payment.appointment)
payment: Payment;

// Cada pago pertenece a una cita
@OneToOne(() => Appointment, (appointment) => appointment.payment)
appointment: Appointment;
```

## Tipos Enum Definidos

### 👤 Roles de Usuario

```typescript
export enum ERole {
  PATIENT = 'Paciente',
  PSYCHOLOGIST = 'Psicólogo',
  ADMIN = 'Administrador',
}
```

### 🏥 Obras Sociales

```typescript
export enum EInsurance {
  OSDE = 'OSDE',
  SWISS_MEDICAL = 'Swiss Medical',
  IOMA = 'IOMA',
  PAMI = 'PAMI',
  // ... más opciones
}
```

### 🧠 Especialidades Psicológicas

```typescript
export enum EPsychologistSpecialty {
  ANXIETY_DISORDER = 'Trastorno de ansiedad',
  COUPLES_THERAPY = 'Terapia de pareja',
  EATING_DISORDER = 'Trastorno de la alimentación',
  DEPRESSION = 'Depresión',
  TRAUMA_PTSD = 'Trauma y TEPT',
  // ... más especialidades
}
```

### 📅 Estados de Cita

```typescript
export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}
```

### 🏠 Modalidades de Atención

```typescript
export enum EModality {
  IN_PERSON = 'Presencial',
  ONLINE = 'En línea',
  HYBRID = 'Híbrido',
}
```

## Configuración de Desarrollo

### 🛠️ Setup Local

#### 1. **Instalación de PostgreSQL**

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS (con Homebrew)
brew install postgresql

# Windows
# Descargar desde https://www.postgresql.org/download/windows/
```

#### 2. **Configuración de Base de Datos**

```sql
-- Conectarse a PostgreSQL
sudo -u postgres psql

-- Crear base de datos
CREATE DATABASE psymatch_db;

-- Crear usuario
CREATE USER psymatch_user WITH PASSWORD 'secure_password';

-- Otorgar privilegios
GRANT ALL PRIVILEGES ON DATABASE psymatch_db TO psymatch_user;

-- Habilitar extensión UUID
\c psymatch_db
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

#### 3. **Variables de Entorno**

```bash
# .env.development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=psymatch_db
DB_USERNAME=psymatch_user
DB_PASSWORD=secure_password
DB_SSL=false
ENVIRONMENT=development
```

## Integración con Frontend (Next.js)

### 🔧 Configuración del Cliente de Base de Datos

```typescript
// lib/database.ts
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  ssl?: boolean;
}

export const getDatabaseConfig = (): DatabaseConfig => ({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'psymatch_db',
  ssl: process.env.NODE_ENV === 'production',
});

// Tipos para el frontend
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Paciente' | 'Psicólogo' | 'Administrador';
  profile_picture?: string;
  created_at: string;
}

export interface Patient extends User {
  address?: string;
  health_insurance?: string;
  emergency_contact?: string;
  appointments: Appointment[];
}

export interface Psychologist extends User {
  personal_biography: string;
  license_number: number;
  specialities: string[];
  verified: 'Pendiente' | 'Validado' | 'Rechazado';
  professional_experience: number;
  appointments: Appointment[];
  reviews: Review[];
}

export interface Appointment {
  id: string;
  date: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  modality: 'Presencial' | 'En línea' | 'Híbrido';
  patient: Patient;
  psychologist: Psychologist;
}
```

### 📊 Hook para Consultas de Base de Datos

```typescript
// hooks/useDatabase.ts
import { useState, useEffect } from 'react';
import { useAuthenticatedFetch } from './useAuthenticatedFetch';

export function useDatabase<T>(endpoint: string, dependencies: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const authenticatedFetch = useAuthenticatedFetch();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      setData(result.data || result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
}

// Hooks específicos
export const useUsers = () => useDatabase<User[]>('/users');
export const usePatients = () => useDatabase<Patient[]>('/users?role=Paciente');
export const usePsychologists = () =>
  useDatabase<Psychologist[]>('/users?role=Psicólogo');
export const useAppointments = () =>
  useDatabase<Appointment[]>('/appointments');
```

### 📈 Componente de Dashboard con Datos de BD

```typescript
// components/DatabaseDashboard.tsx
'use client';

import { useUsers, useAppointments } from '../hooks/useDatabase';

export default function DatabaseDashboard() {
  const { data: users, loading: usersLoading } = useUsers();
  const { data: appointments, loading: appointmentsLoading } = useAppointments();

  if (usersLoading || appointmentsLoading) {
    return <div>Cargando datos de la base de datos...</div>;
  }

  const statistics = {
    totalUsers: users?.length || 0,
    totalPatients: users?.filter(u => u.role === 'Paciente').length || 0,
    totalPsychologists: users?.filter(u => u.role === 'Psicólogo').length || 0,
    totalAppointments: appointments?.length || 0,
    completedAppointments: appointments?.filter(a => a.status === 'completed').length || 0
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900">Total Usuarios</h3>
        <p className="text-3xl font-bold text-blue-600">{statistics.totalUsers}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900">Pacientes</h3>
        <p className="text-3xl font-bold text-green-600">{statistics.totalPatients}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900">Psicólogos</h3>
        <p className="text-3xl font-bold text-purple-600">{statistics.totalPsychologists}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900">Total Citas</h3>
        <p className="text-3xl font-bold text-orange-600">{statistics.totalAppointments}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900">Citas Completadas</h3>
        <p className="text-3xl font-bold text-teal-600">{statistics.completedAppointments}</p>
      </div>
    </div>
  );
}
```

## Migraciones de Base de Datos

### 📝 Setup de Migraciones

```bash
# Generar nueva migración
npm run typeorm migration:generate -- -n NombreMigracion

# Ejecutar migraciones
npm run typeorm migration:run

# Revertir última migración
npm run typeorm migration:revert
```

### 🔄 Script de Migración de Ejemplo

```typescript
// migrations/1673123456789-CreateInitialTables.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialTables1673123456789 implements MigrationInterface {
  name = 'CreateInitialTables1673123456789';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear tipos enum
    await queryRunner.query(`
            CREATE TYPE "user_role" AS ENUM('Paciente', 'Psicólogo', 'Administrador')
        `);

    await queryRunner.query(`
            CREATE TYPE "appointment_status" AS ENUM('pending', 'confirmed', 'completed', 'cancelled')
        `);

    // Crear tabla users
    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" text NOT NULL,
                "email" text NOT NULL,
                "role" "user_role" NOT NULL DEFAULT 'Paciente',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_users" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_users_email" UNIQUE ("email")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "user_role"`);
    await queryRunner.query(`DROP TYPE "appointment_status"`);
  }
}
```

## Optimización y Performance

### 🚀 Índices de Base de Datos

```sql
-- Índices recomendados para mejor performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_dni ON users(dni);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_appointments_date ON appointments(date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_psychologist_id ON appointments(psychologist_id);
CREATE INDEX idx_reviews_psychologist_id ON reviews(psychologist_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_payments_status ON payments(pay_status);
```

### 📊 Consultas Optimizadas

```typescript
// Consultas con joins optimizados
const appointmentsWithDetails = await appointmentRepository
  .createQueryBuilder('appointment')
  .leftJoinAndSelect('appointment.patient', 'patient')
  .leftJoinAndSelect('appointment.psychologist', 'psychologist')
  .where('appointment.date >= :startDate', { startDate: new Date() })
  .orderBy('appointment.date', 'ASC')
  .getMany();

// Paginación eficiente
const paginatedUsers = await userRepository
  .createQueryBuilder('user')
  .where('user.is_active = :isActive', { isActive: true })
  .skip((page - 1) * limit)
  .take(limit)
  .getManyAndCount();
```

### 🔄 Pool de Conexiones

```typescript
// Configuración optimizada para producción
export const typeorm: DataSourceOptions = {
  // ... otras configuraciones
  extra: {
    max: 20, // Máximo número de conexiones
    min: 5, // Mínimo número de conexiones
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },
};
```

## Backup y Restauración

### 💾 Scripts de Backup

```bash
#!/bin/bash
# backup-database.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="psymatch_db"

# Crear backup
pg_dump -h localhost -U psymatch_user -d $DB_NAME > $BACKUP_DIR/psymatch_backup_$DATE.sql

# Comprimir backup
gzip $BACKUP_DIR/psymatch_backup_$DATE.sql

echo "Backup completado: psymatch_backup_$DATE.sql.gz"
```

### 🔄 Script de Restauración

```bash
#!/bin/bash
# restore-database.sh

BACKUP_FILE=$1
DB_NAME="psymatch_db"

if [ -z "$BACKUP_FILE" ]; then
    echo "Uso: ./restore-database.sh <archivo_backup.sql.gz>"
    exit 1
fi

# Descomprimir si es necesario
if [[ $BACKUP_FILE == *.gz ]]; then
    gunzip $BACKUP_FILE
    BACKUP_FILE="${BACKUP_FILE%.gz}"
fi

# Restaurar base de datos
psql -h localhost -U psymatch_user -d $DB_NAME < $BACKUP_FILE

echo "Restauración completada desde: $BACKUP_FILE"
```

## Monitoreo y Logs

### 📈 Métricas de Base de Datos

```typescript
// utils/database-metrics.ts
export class DatabaseMetrics {
  async getConnectionCount() {
    const result = await dataSource.query(`
      SELECT count(*) as active_connections 
      FROM pg_stat_activity 
      WHERE state = 'active'
    `);
    return result[0].active_connections;
  }

  async getTableSizes() {
    const result = await dataSource.query(`
      SELECT 
        schemaname,
        tablename,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
    `);
    return result;
  }

  async getSlowQueries() {
    const result = await dataSource.query(`
      SELECT query, mean_time, calls, total_time
      FROM pg_stat_statements 
      ORDER BY mean_time DESC 
      LIMIT 10
    `);
    return result;
  }
}
```

## Seguridad de Datos

### 🔒 Configuraciones de Seguridad

```typescript
// Configuración segura para producción
export const productionTypeormConfig: DataSourceOptions = {
  type: 'postgres',
  ssl: {
    rejectUnauthorized: false,
    ca: process.env.DB_SSL_CERT,
  },
  extra: {
    ssl: true,
    application_name: 'psymatch-backend',
  },
  logging: false, // Desactivar logging en producción
  synchronize: false, // NUNCA usar en producción
  migrationsRun: true,
};
```

### 🛡️ Validaciones de Integridad

```sql
-- Constraints de integridad
ALTER TABLE appointments
ADD CONSTRAINT chk_appointment_date_future
CHECK (date > CURRENT_TIMESTAMP);

ALTER TABLE reviews
ADD CONSTRAINT chk_rating_range
CHECK (rating >= 1 AND rating <= 5);

ALTER TABLE payments
ADD CONSTRAINT chk_amount_positive
CHECK (amount > 0);
```

## Consideraciones de Producción

### 🚀 Configuración para Producción

```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: psymatch_db
      POSTGRES_USER: psymatch_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-scripts:/docker-entrypoint-initdb.d
    ports:
      - '5432:5432'
    restart: unless-stopped
    command: >
      postgres
      -c shared_preload_libraries=pg_stat_statements
      -c pg_stat_statements.track=all
      -c max_connections=200
      -c shared_buffers=256MB
      -c effective_cache_size=1GB

volumes:
  postgres_data:
```

### 📊 Monitoreo con Logs

```typescript
// logger/database-logger.ts
export class DatabaseLogger implements Logger {
  logQuery(query: string, parameters?: any[]) {
    if (process.env.NODE_ENV === 'development') {
      console.log('Query:', query);
      console.log('Parameters:', parameters);
    }
  }

  logQueryError(error: string, query: string, parameters?: any[]) {
    console.error('Query Error:', error);
    console.error('Query:', query);
    console.error('Parameters:', parameters);
  }

  logQuerySlow(time: number, query: string, parameters?: any[]) {
    console.warn(`Slow Query (${time}ms):`, query);
  }
}
```

## Próximas Mejoras

- [ ] Implementación completa de migraciones automáticas
- [ ] Configuración de réplicas de lectura
- [ ] Cache con Redis para consultas frecuentes
- [ ] Auditoría de cambios en entidades críticas
- [ ] Backup automático programado
- [ ] Monitoreo avanzado con métricas personalizadas
- [ ] Optimización de consultas con análisis de performance
- [ ] Implementación de soft deletes
- [ ] Versionado de esquemas con changelog automático
- [ ] Integración con herramientas de monitoreo (Grafana, Prometheus)
