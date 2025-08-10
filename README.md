# PsyMatch Backend

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Swagger](https://img.shields.io/badge/swagger-%2385EA2D.svg?style=for-the-badge&logo=swagger&logoColor=black)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

## 📋 Descripción

**PsyMatch Backend** es una API REST robusta y escalable desarrollada con NestJS que facilita la conexión entre pacientes y psicólogos profesionales. La plataforma ofrece una solución integral para la gestión de servicios de salud mental, incluyendo autenticación segura, gestión de usuarios, programación de citas, historiales médicos, procesamiento de pagos y sistema de reseñas.

## ✨ Características Principales

### 🔐 Seguridad y Autenticación

- **JWT Authentication** con tokens seguros y refresh tokens
- **OAuth 2.0** integración con Google
- **Autorización basada en roles** (Paciente, Psicólogo, Admin)
- **Validación exhaustiva** con class-validator
- **Encriptación de contraseñas** con bcrypt

### 👥 Gestión Completa de Usuarios

- **CRUD completo** para pacientes, psicólogos y administradores
- **Perfiles detallados** con información personal y profesional
- **Sistema de verificación** para psicólogos
- **Geolocalización** integrada para ubicaciones
- **Subida de imágenes** a Cloudinary

### 📅 Sistema Avanzado de Citas

- **Programación flexible** de sesiones terapéuticas
- **Modalidades** presencial y virtual
- **Estados de cita** (Pendiente, Confirmada, Completada, Cancelada)
- **Duraciones personalizables** de sesiones
- **Historial completo** de citas

### 📋 Gestión de Historiales Médicos

- **Registros detallados** de consultas y tratamientos
- **Control de acceso** basado en roles
- **Soft delete** para mantener integridad de datos
- **Búsqueda avanzada** por usuario y psicólogo
- **Filtros por estado** (activo/inactivo)

### 💳 Procesamiento de Pagos

- **Múltiples métodos de pago** soportados
- **Estados de transacción** completos
- **Historial de pagos** detallado
- **Reportes administrativos** para finanzas
- **Integración segura** con pasarelas de pago

### ⭐ Sistema de Reseñas y Calificaciones

- **Calificaciones de 1 a 5 estrellas**
- **Comentarios detallados** de experiencias
- **Promedios automáticos** de calificaciones
- **Moderación administrativa** de contenido
- **Estadísticas completas** por psicólogo

### 📚 Documentación y API

- **Swagger/OpenAPI** completa y actualizada
- **Ejemplos detallados** para cada endpoint
- **Esquemas de respuesta** bien definidos
- **Códigos de error** descriptivos
- **Documentación interactiva** disponible en `/api`

## 🏗️ Arquitectura del Sistema

### Estructura Modular

```
src/
├── assets/                    # Recursos estáticos y documentación
├── common/                    # Utilidades compartidas
│   ├── decorators/           # Decoradores personalizados
│   ├── dto/                  # DTOs comunes (paginación)
│   ├── enums/                # Enumeraciones globales
│   ├── interceptors/         # Interceptores de logging y transformación
│   └── services/             # Servicios compartidos
├── configs/                   # Configuraciones de la aplicación
│   ├── cloudinary.config.ts  # Configuración de almacenamiento
│   ├── envs.config.ts        # Variables de entorno
│   ├── swagger.config.ts     # Configuración de documentación
│   └── typeorm.config.ts     # Configuración de base de datos
└── modules/
    ├── auth/                 # Autenticación y autorización
    │   ├── decorators/       # Decoradores de roles
    │   ├── dto/              # DTOs de auth
    │   ├── guards/           # Guards de seguridad
    │   ├── interfaces/       # Interfaces de auth
    │   └── strategies/       # Estrategias de passport
    ├── users/                # Gestión de usuarios
    │   ├── dto/              # DTOs de usuarios
    │   └── entities/         # Entidades de usuarios
    ├── psychologist/         # Gestión específica de psicólogos
    │   ├── dto/              # DTOs de psicólogos
    │   ├── entities/         # Entidad de psicólogo
    │   ├── enums/            # Enums específicos
    │   └── interfaces/       # Interfaces de psicólogo
    ├── appointments/         # Sistema de citas
    ├── records/              # Historiales médicos
    ├── payments/             # Procesamiento de pagos
    ├── reviews/              # Sistema de reseñas
    ├── files/                # Manejo de archivos
    ├── database/             # Configuración de BD
    ├── seeder/               # Datos de prueba
    └── utils/                # Utilidades y helpers
```

### Stack Tecnológico Completo

**Backend Framework**

- **NestJS** v10+ - Framework Node.js empresarial
- **TypeScript** v5+ - Tipado estático y moderno

**Base de Datos**

- **PostgreSQL** v13+ - Base de datos relacional robusta
- **TypeORM** v0.3+ - ORM moderno y type-safe

**Autenticación y Seguridad**

- **Passport** - Middleware de autenticación
- **JWT** - Tokens seguros de autenticación
- **bcrypt** - Hash de contraseñas
- **class-validator** - Validación de datos

**Documentación y Testing**

- **Swagger/OpenAPI** - Documentación interactiva de API
- **Jest** - Framework de testing

**Almacenamiento y Archivos**

- **Cloudinary** - CDN para imágenes y archivos
- **Multer** - Manejo de uploads

**Desarrollo y Deployment**

- **Docker** - Containerización
- **Prettier** - Formateo de código
- **ESLint** - Linting y calidad de código

## 🚀 Instalación y Configuración

### Prerrequisitos del Sistema

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0
- **PostgreSQL** >= 13.0
- **Docker** >= 20.0 (opcional)
- **Git** para clonar el repositorio

### Instalación Local Paso a Paso

1. **Clonar el repositorio**

   ```bash
   git clone <repository-url>
   cd PsyMatch-Backend
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**

   ```bash
   cp .env.example .env
   ```

   Editar el archivo `.env` con tus configuraciones específicas.

4. **Configurar la base de datos**

   ```bash
   # Crear la base de datos
   createdb psymatch_db

   # Ejecutar migraciones (si existen)
   npm run migration:run

   # Ejecutar seeders para datos de prueba
   npm run seed
   ```

5. **Iniciar el servidor de desarrollo**

   ```bash
   npm run start:dev
   ```

   El servidor estará disponible en: `http://localhost:3000`
   La documentación Swagger en: `http://localhost:3000/api`

### Instalación con Docker

```bash
# Construir y ejecutar todos los servicios
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f

# Ejecutar comandos dentro del contenedor
docker-compose exec backend npm run seed

# Detener todos los servicios
docker-compose down

# Reiniciar servicios específicos
docker-compose restart backend
```

## ⚙️ Variables de Entorno Completas

Crear un archivo `.env` en la raíz del proyecto con todas las configuraciones:

```env
# ===========================================
# CONFIGURACIÓN DEL SERVIDOR
# ===========================================
NODE_ENV=development
PORT=3000
HOST=localhost

# ===========================================
# CONFIGURACIÓN DE BASE DE DATOS
# ===========================================
DB_HOST=localhost
DB_PORT=5432
DB_NAME=psymatch_db
DB_USERNAME=postgres
DB_PASSWORD=your_secure_password
DB_SSL=false
DB_SYNCHRONIZE=false
DB_LOGGING=true

# ===========================================
# CONFIGURACIÓN DE AUTENTICACIÓN JWT
# ===========================================
JWT_SECRET=your_super_secret_jwt_key_here_with_at_least_32_characters
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_token_secret_here
JWT_REFRESH_EXPIRES_IN=30d

# ===========================================
# CONFIGURACIÓN DE CLOUDINARY
# ===========================================
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# ===========================================
# CONFIGURACIÓN DE GOOGLE OAUTH (OPCIONAL)
# ===========================================
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# ===========================================
# CONFIGURACIÓN DE CORS
# ===========================================
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
CORS_CREDENTIALS=true

# ===========================================
# CONFIGURACIÓN DE ARCHIVOS
# ===========================================
MAX_FILE_SIZE=5242880  # 5MB en bytes
ALLOWED_FILE_TYPES=jpg,jpeg,png,webp

# ===========================================
# CONFIGURACIÓN DE PAGINACIÓN
# ===========================================
DEFAULT_PAGE_SIZE=10
MAX_PAGE_SIZE=100

# ===========================================
# CONFIGURACIÓN DE RATE LIMITING
# ===========================================
THROTTLE_TTL=60
THROTTLE_LIMIT=100
```

## 📡 Endpoints de la API

### 🔐 Autenticación (`/auth`)

| Método | Endpoint                    | Descripción               | Roles   |
| ------ | --------------------------- | ------------------------- | ------- |
| `POST` | `/auth/signup`              | Registro de nuevo usuario | Público |
| `POST` | `/auth/signup-psychologist` | Registro de psicólogo     | Público |
| `POST` | `/auth/signin`              | Inicio de sesión          | Público |
| `GET`  | `/auth/google`              | Autenticación con Google  | Público |
| `GET`  | `/auth/google/callback`     | Callback de Google OAuth  | Público |

### 👥 Usuarios (`/users`)

| Método   | Endpoint          | Descripción               | Roles         |
| -------- | ----------------- | ------------------------- | ------------- |
| `GET`    | `/users`          | Listar todos los usuarios | Admin         |
| `GET`    | `/users/patients` | Listar solo pacientes     | Admin         |
| `GET`    | `/users/:id`      | Obtener usuario por ID    | Usuario/Admin |
| `PUT`    | `/users/:id`      | Actualizar usuario        | Usuario/Admin |
| `DELETE` | `/users/:id`      | Eliminar usuario          | Usuario/Admin |

### 👨‍⚕️ Psicólogos (`/psychologist`)

| Método   | Endpoint                   | Descripción                       | Roles           |
| -------- | -------------------------- | --------------------------------- | --------------- |
| `POST`   | `/psychologist/register`   | Solicitar registro como psicólogo | Paciente/Admin  |
| `GET`    | `/psychologist/pending`    | Obtener solicitudes pendientes    | Admin           |
| `PUT`    | `/psychologist/:id/verify` | Verificar psicólogo               | Admin           |
| `PUT`    | `/psychologist/:id`        | Actualizar datos de psicólogo     | Psicólogo/Admin |
| `DELETE` | `/psychologist/:id`        | Eliminar psicólogo                | Admin           |

### 📅 Citas (`/appointments`)

| Método   | Endpoint            | Descripción            | Roles                    |
| -------- | ------------------- | ---------------------- | ------------------------ |
| `POST`   | `/appointments`     | Crear nueva cita       | Paciente/Admin           |
| `GET`    | `/appointments`     | Listar todas las citas | Todos los autenticados   |
| `GET`    | `/appointments/:id` | Obtener cita por ID    | Todos los autenticados   |
| `PUT`    | `/appointments/:id` | Actualizar cita        | Paciente/Psicólogo/Admin |
| `DELETE` | `/appointments/:id` | Cancelar/Eliminar cita | Paciente/Psicólogo/Admin |

### 📋 Historiales Médicos (`/records`)

| Método   | Endpoint                                             | Descripción                        | Roles                    |
| -------- | ---------------------------------------------------- | ---------------------------------- | ------------------------ |
| `POST`   | `/records`                                           | Crear nuevo historial              | Psicólogo                |
| `GET`    | `/records`                                           | Listar todos los historiales       | Admin                    |
| `GET`    | `/records/:id`                                       | Obtener historial por ID           | Psicólogo/Paciente/Admin |
| `GET`    | `/records/user/:userId`                              | Historiales de un usuario          | Psicólogo/Paciente/Admin |
| `GET`    | `/records/psychologist/:psychologistId`              | Historiales de un psicólogo        | Psicólogo/Admin          |
| `GET`    | `/records/user/:userId/psychologist/:psychologistId` | Historiales de relación específica | Psicólogo/Admin          |
| `PUT`    | `/records/:id`                                       | Actualizar historial               | Psicólogo/Admin          |
| `DELETE` | `/records/:id`                                       | Eliminar historial                 | Psicólogo/Admin          |
| `PUT`    | `/records/:id/soft-delete`                           | Desactivar historial               | Psicólogo/Admin          |

### 💳 Pagos (`/payments`)

| Método   | Endpoint        | Descripción               | Roles                    |
| -------- | --------------- | ------------------------- | ------------------------ |
| `POST`   | `/payments`     | Procesar nuevo pago       | Paciente/Admin           |
| `GET`    | `/payments`     | Listar todos los pagos    | Admin                    |
| `GET`    | `/payments/:id` | Obtener pago por ID       | Paciente/Psicólogo/Admin |
| `PUT`    | `/payments/:id` | Actualizar estado de pago | Admin                    |
| `DELETE` | `/payments/:id` | Eliminar registro de pago | Admin                    |

### ⭐ Reseñas (`/reviews`)

| Método   | Endpoint       | Descripción                  | Roles                    |
| -------- | -------------- | ---------------------------- | ------------------------ |
| `POST`   | `/reviews`     | Crear nueva reseña           | Paciente/Psicólogo/Admin |
| `GET`    | `/reviews/:id` | Obtener reseñas de psicólogo | Todos los autenticados   |
| `DELETE` | `/reviews/:id` | Eliminar reseña              | Admin                    |

## 📖 Documentación Interactiva de la API

### Acceso a Swagger UI

La documentación completa y interactiva de la API está disponible en:

**Desarrollo**: `http://localhost:3000/api`
**Producción**: `https://your-domain.com/api`

### Características de la Documentación

- ✅ **Endpoints completos** con descripciones detalladas
- ✅ **Esquemas de request/response** con ejemplos
- ✅ **Códigos de estado HTTP** explicados
- ✅ **Autenticación JWT** integrada en la UI
- ✅ **Validaciones** y restricciones documentadas
- ✅ **Modelos de datos** completamente tipados
- ✅ **Ejemplos en vivo** para testing

### Testing desde Swagger

1. Navegar a `/api` en tu navegador
2. Autenticarse usando el endpoint `/auth/signin`
3. Copiar el token JWT retornado
4. Hacer clic en "Authorize" en la parte superior
5. Pegar el token en el formato: `Bearer YOUR_TOKEN_HERE`
6. Probar cualquier endpoint directamente desde la interfaz

## 🗄️ Esquema de Base de Datos

### Diseño de la Base de Datos

La base de datos utiliza **Single Table Inheritance (STI)** para optimizar las consultas y mantener la integridad referencial.

#### Entidades Principales

**Users (Tabla Base)**

```sql
- id (UUID, PK)
- name (VARCHAR)
- email (VARCHAR, UNIQUE)
- password (VARCHAR, HASHED)
- dni (INTEGER, UNIQUE)
- social_security_number (VARCHAR, UNIQUE)
- phone (VARCHAR, NULLABLE)
- address (VARCHAR, NULLABLE)
- latitude (DECIMAL, NULLABLE)
- longitude (DECIMAL, NULLABLE)
- profile_picture (VARCHAR, NULLABLE)
- birthdate (DATE, NULLABLE)
- role (ENUM: PATIENT, PSYCHOLOGIST, ADMIN)
- verified (ENUM: PENDING, VALIDATED, REJECTED, NULL)
- is_active (BOOLEAN, DEFAULT: true)
- provider (VARCHAR, NULLABLE) -- Para OAuth
- provider_id (VARCHAR, NULLABLE) -- Para OAuth
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

**Psychologists (Hereda de Users)**

```sql
- id (UUID, PK, FK to users.id)
- office_address (VARCHAR)
- license_number (VARCHAR, UNIQUE)
- specialities (ENUM ARRAY)
- session_types (ENUM ARRAY)
- therapy_approaches (ENUM ARRAY)
```

**Appointments**

```sql
- appointment_id (UUID, PK)
- user_id (UUID, FK to users.id)
- psychologist_id (UUID, FK to users.id)
- date (TIMESTAMP)
- duration (INTEGER, DEFAULT: 60)
- status (ENUM: PENDING, CONFIRMED, CANCELLED, COMPLETED)
- modality (ENUM: ONLINE, IN_PERSON)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

**Records**

```sql
- id (UUID, PK)
- user_id (UUID, FK to users.id)
- psychologist_id (UUID, FK to users.id)
- title (VARCHAR)
- description (TEXT)
- record_type (ENUM)
- is_active (BOOLEAN, DEFAULT: true)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

**Payments**

```sql
- payment_id (UUID, PK)
- user_id (UUID, FK to users.id)
- psychologist_id (UUID, FK to users.id)
- appointment_id (UUID, FK to appointments.appointment_id)
- amount (DECIMAL)
- currency (VARCHAR, DEFAULT: 'USD')
- payment_method (ENUM)
- status (ENUM)
- transaction_id (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

**Reviews**

```sql
- id (UUID, PK)
- user_id (UUID, FK to users.id)
- psychologist_id (UUID, FK to users.id)
- rating (INTEGER, CHECK: 1-5)
- comment (TEXT)
- is_active (BOOLEAN, DEFAULT: true)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Relaciones de la Base de Datos

- **Users ↔ Appointments**: One-to-Many (como paciente)
- **Psychologists ↔ Appointments**: One-to-Many (como profesional)
- **Users ↔ Records**: One-to-Many (historial del paciente)
- **Psychologists ↔ Records**: One-to-Many (creado por psicólogo)
- **Users ↔ Payments**: One-to-Many (pagos del paciente)
- **Appointments ↔ Payments**: One-to-One (pago por cita)
- **Users ↔ Reviews**: One-to-Many (reseñas escritas)
- **Psychologists ↔ Reviews**: One-to-Many (reseñas recibidas)

### Características Especiales

**Validaciones de Datos**

- DNI argentino (7-8 dígitos)
- Teléfonos internacionales
- Emails únicos por usuario activo
- Coordenadas GPS válidas

**Soft Delete**

- Usuarios: campo `is_active`
- Historiales: campo `is_active`
- Reseñas: campo `is_active`

**Enumeraciones Específicas**

- Especialidades psicológicas
- Tipos de sesión
- Enfoques terapéuticos
- Estados de verificación
- Métodos de pago

## 🧪 Scripts de Desarrollo y Operación

### Scripts de Desarrollo

```bash
# Servidor de desarrollo con hot reload
npm run start:dev

# Servidor de desarrollo con debug habilitado
npm run start:debug

# Construir la aplicación para producción
npm run build

# Ejecutar la aplicación compilada
npm run start:prod
```

### Scripts de Calidad de Código

```bash
# Ejecutar linting con ESLint
npm run lint

# Corregir problemas de linting automáticamente
npm run lint:fix

# Formatear código con Prettier
npm run format

# Verificar formato sin modificar archivos
npm run format:check

# Organizar y limpiar imports
npm run fix-imports

# Ejecutar todos los checks de calidad
npm run check:all
```

### Scripts de Base de Datos

```bash
# Generar nueva migración basada en cambios de entidades
npm run migration:generate -- --name=MigrationName

# Ejecutar todas las migraciones pendientes
npm run migration:run

# Revertir la última migración
npm run migration:revert

# Ejecutar seeders para datos de prueba
npm run seed

# Limpiar y recargar base de datos completa
npm run db:reset
```

### Scripts de Testing

```bash
# Ejecutar todos los tests
npm run test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con coverage
npm run test:cov

# Ejecutar tests e2e
npm run test:e2e

# Ejecutar tests de una suite específica
npm run test -- --testNamePattern="UserService"
```

### Scripts de Docker

```bash
# Construir y levantar todos los contenedores
npm run docker:up

# Levantar en modo background/daemon
npm run docker:up:daemon

# Ver logs de todos los servicios
npm run docker:logs

# Ver logs de un servicio específico
npm run docker:logs:backend

# Bajar todos los contenedores
npm run docker:down

# Bajar contenedores y limpiar volúmenes
npm run docker:down:clean

# Reiniciar todos los servicios
npm run docker:restart

# Ejecutar comando dentro del contenedor backend
npm run docker:exec -- npm run seed
```

### Scripts de Deployment

```bash
# Construir imagen para producción
npm run build:prod

# Ejecutar health checks
npm run health:check

# Generar documentación de API
npm run docs:generate

# Validar configuración de producción
npm run config:validate
```

## 🔐 Seguridad y Buenas Prácticas

### Implementaciones de Seguridad

**Autenticación Robusta**

- Tokens JWT con expiración configurable
- Refresh tokens para sesiones largas
- Hash de contraseñas con bcrypt y salt rounds altos
- Validación de fuerza de contraseña obligatoria

**Autorización Granular**

- Sistema de roles jerárquico (Paciente < Psicólogo < Admin)
- Guards personalizados para endpoints específicos
- Validación de ownership para recursos privados
- Middleware de autorización en todas las rutas protegidas

**Validación de Datos**

- Sanitización automática de inputs
- Validación de tipos con class-validator
- Restricciones de longitud y formato
- Prevención de inyecciones SQL con TypeORM

**Protección contra Ataques**

- Rate limiting configurado por endpoint
- CORS configurado para dominios específicos
- Validación de archivos subidos (tipo, tamaño, extensión)
- Headers de seguridad con Helmet

**Gestión de Archivos Segura**

- Subida directa a Cloudinary (sin almacenamiento local)
- Validación de tipos MIME
- Límites de tamaño configurables
- URLs firmadas para acceso temporal

### Buenas Prácticas Implementadas

**Código Limpio**

- Arquitectura modular con separación de responsabilidades
- DTOs tipados para todas las operaciones
- Interfaces bien definidas
- Documentación automática con decoradores

**Rendimiento**

- Conexiones de BD con pooling
- Consultas optimizadas con índices
- Paginación en todos los listados
- Caché de consultas frecuentes

**Mantenibilidad**

- Logging estructurado con diferentes niveles
- Manejo de errores centralizado
- Configuración por variables de entorno
- Tests automatizados para funcionalidades críticas

## 🌍 Características de Localización Argentina

### Formatos de Datos Locales

**Fechas y Horarios**

```typescript
// Formato argentino: DD-MM-YYYY
birthdate: '15-05-1990';
appointment_date: '2024-03-15T14:00:00-03:00'; // UTC-3 Argentina
```

**Números de Documento**

```typescript
// DNI argentino: 7-8 dígitos
dni: 12345678;
// Validación automática de rango y formato
```

**Números de Teléfono**

```typescript
// Formato internacional argentino
phone: '+5411123456789'; // Buenos Aires
phone: '+542614567890'; // Mendoza
phone: '+543514567890'; // Córdoba
```

**Números de Obra Social**

```typescript
// Formato estándar argentino XXX-XX-XXXX
social_security_number: '123-45-6789';
```

### Validaciones Específicas

**Geolocalización Argentina**

```typescript
// Coordenadas válidas para Argentina
latitude: -34.6037; // Buenos Aires
longitude: -58.3816; // Buenos Aires

// Validación de rangos geográficos argentinos
latitude_range: [-55.0, -21.0]; // Ushuaia a La Quiaca
longitude_range: [-73.0, -53.0]; // Oeste a Este
```

**Direcciones Locales**

```typescript
// Formatos de direcciones argentinas
address: 'Av. Corrientes 1234, CABA, Buenos Aires';
address: 'San Martín 456, Mendoza Capital, Mendoza';
office_address: 'Consultorio en Av. Santa Fe 2000, Piso 5, Oficina B';
```

### Integración con Servicios Locales

**Mapas y Ubicaciones**

- Integración con Google Maps Argentina
- Búsqueda de direcciones argentinas
- Cálculo de distancias entre ciudades
- Zonas de atención por provincia

**Regulaciones de Salud**

- Validación de números de matrícula profesional
- Cumplimiento con normativas de privacidad médica
- Formatos de historias clínicas según normativa argentina

## 📋 Estado Actual del Proyecto

### ✅ Funcionalidades Completadas

**Core del Sistema**

- [x] Arquitectura modular con NestJS
- [x] Base de datos PostgreSQL con TypeORM
- [x] Autenticación JWT completa
- [x] Sistema de roles y permisos
- [x] Documentación Swagger completa

**Gestión de Usuarios**

- [x] CRUD completo de usuarios
- [x] Registro de pacientes y psicólogos
- [x] Validación de datos argentinos
- [x] Geolocalización integrada
- [x] Subida de imágenes de perfil

**Sistema de Citas**

- [x] Creación y gestión de citas
- [x] Estados de cita completos
- [x] Modalidades presencial y virtual
- [x] Validaciones de fechas y horarios

**Historiales Médicos**

- [x] CRUD de historiales
- [x] Control de acceso granular
- [x] Soft delete implementado
- [x] Búsquedas avanzadas

**Pagos y Reseñas**

- [x] Sistema de pagos básico
- [x] Reseñas con calificaciones
- [x] Estadísticas de reseñas

**Seguridad y Calidad**

- [x] Validaciones exhaustivas
- [x] Rate limiting configurado
- [x] Headers de seguridad
- [x] Logs estructurados

### 🚧 En Desarrollo

**Integraciones de Pago**

- [ ] Integración con Mercado Pago
- [ ] Procesamiento de reembolsos
- [ ] Reportes financieros avanzados

**Notificaciones**

- [ ] Sistema de emails transaccionales
- [ ] Notificaciones push
- [ ] Recordatorios de citas

**Analytics y Reportes**

- [ ] Dashboard administrativo
- [ ] Métricas de uso
- [ ] Reportes de satisfacción

### 🔮 Roadmap Futuro

**Funcionalidades Avanzadas**

- [ ] Sistema de mensajería interno
- [ ] Videollamadas integradas
- [ ] Integración con calendarios externos
- [ ] App móvil nativa

**Escalabilidad**

- [ ] Microservicios architecture
- [ ] Cache distribuido con Redis
- [ ] CDN para assets estáticos
- [ ] Balanceador de carga

**Compliance y Regulaciones**

- [ ] Certificación ISO 27001
- [ ] Cumplimiento GDPR/LGPD
- [ ] Auditoría de seguridad externa
- [ ] Backup y disaster recovery

## 🤝 Contribución y Desarrollo

### Estándares de Código

**Convenciones de Naming**

```typescript
// Archivos: kebab-case
user-management.service.ts
create-appointment.dto.ts

// Clases: PascalCase
class UserManagementService
class CreateAppointmentDto

// Variables y funciones: camelCase
const userName = 'john_doe'
function getUserById(id: string)

// Constantes: SCREAMING_SNAKE_CASE
const MAX_FILE_SIZE = 5242880
const DEFAULT_PAGE_SIZE = 10
```

**Estructura de Commits**

```bash
# Tipos de commits permitidos
feat: nueva funcionalidad
fix: corrección de bugs
docs: cambios en documentación
style: formateo, espacios, etc.
refactor: refactoring de código
test: agregar o modificar tests
chore: tareas de mantenimiento

# Ejemplos
git commit -m "feat: add payment processing system"
git commit -m "fix: resolve user authentication bug"
git commit -m "docs: update API documentation"
```

### Proceso de Contribución

1. **Fork del Repositorio**

   ```bash
   git clone https://github.com/your-username/psymatch-backend
   cd psymatch-backend
   ```

2. **Crear Rama de Feature**

   ```bash
   git checkout -b feature/payment-system
   git checkout -b fix/user-auth-bug
   git checkout -b docs/api-documentation
   ```

3. **Desarrollo con Calidad**

   ```bash
   # Escribir código siguiendo estándares
   npm run lint          # Verificar linting
   npm run format        # Formatear código
   npm run test          # Ejecutar tests
   npm run test:cov      # Verificar coverage
   ```

4. **Commit y Push**

   ```bash
   git add .
   git commit -m "feat: implement payment processing"
   git push origin feature/payment-system
   ```

5. **Crear Pull Request**
   - Descripción clara del cambio
   - Screenshots si aplica
   - Lista de testing realizado
   - Referencias a issues relacionados

### Guidelines de Código

**Documentación de Funciones**

```typescript
/**
 * Creates a new appointment between a patient and psychologist
 * @param createAppointmentDto - Data for creating the appointment
 * @returns Promise<Appointment> - The created appointment
 * @throws BadRequestException - If appointment data is invalid
 * @throws NotFoundException - If user or psychologist not found
 */
async createAppointment(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
  // Implementation
}
```

**Manejo de Errores Consistente**

```typescript
try {
  const user = await this.userRepository.findOne({ where: { id } });
  if (!user) {
    throw new NotFoundException(`User with ID ${id} not found`);
  }
  return user;
} catch (error) {
  this.logger.error(`Failed to find user: ${error.message}`, error.stack);
  throw error;
}
```

**Tests Requeridos**

```typescript
describe('UserService', () => {
  describe('findById', () => {
    it('should return user when valid ID provided', async () => {
      // Test implementation
    });

    it('should throw NotFoundException when user not found', async () => {
      // Test implementation
    });
  });
});
```

## 📄 Licencia y Legal

### Información de Licencia

Este proyecto es **propiedad privada** de PsyMatch y está sujeto a las siguientes condiciones:

- ❌ **No redistribución** - El código no puede ser redistribuido
- ❌ **No uso comercial** - No puede ser usado para fines comerciales externos
- ❌ **No modificación** - No se permite crear trabajos derivados
- ✅ **Uso interno** - Autorizado para desarrollo interno del equipo

### Términos de Uso

**Para Desarrolladores del Equipo**

- Acceso completo al código fuente
- Derecho a modificar para desarrollo interno
- Obligación de mantener confidencialidad
- Prohibición de compartir fuera del equipo

**Para Colaboradores Externos**

- Acceso limitado bajo acuerdo de confidencialidad
- Contribuciones sujetas a revisión legal
- Transferencia de derechos de autoría a PsyMatch

### Contacto Legal

Para consultas sobre licencia y uso:

- **Email Legal**: legal@psymatch.com
- **Desarrollador Principal**: dev@psymatch.com

## 👥 Equipo de Desarrollo

### Core Team

**Arquitectura y Backend**

- Líder Técnico: Franco Gauna
- Desarrolladores Senior: [Nombre]
- DevOps: [Nombre]

**Frontend y UX**

- Líder Frontend: [Nombre]
- Desarrolladores UI: [Nombre]
- Diseñador UX: [Nombre]

**Quality Assurance**

- QA Lead: [Nombre]
- Testers: [Nombre]

### Reconocimientos

Agradecemos a todos los desarrolladores que han contribuido a este proyecto y a las tecnologías open source que hacen posible esta plataforma.

---

## 📞 Soporte y Contacto

### Para Desarrolladores

**Issues y Bugs**

- Crear issue en el repositorio con template correspondiente
- Incluir pasos para reproducir
- Adjuntar logs relevantes

**Preguntas Técnicas**

- Email: dev-team@psymatch.com
- Slack: #psymatch-backend
- Documentación: `/docs` en el repositorio

**Emergencias de Producción**

- WhatsApp: [Número de emergencia]
- Email: emergency@psymatch.com

### Para Usuarios Finales

**Soporte General**

- Email: support@psymatch.com
- Chat en vivo: Disponible en la plataforma
- FAQ: https://psymatch.com/faq

---

**🔄 Última actualización**: Agosto 2025  
**📊 Estado del proyecto**: En desarrollo activo  
**🚀 Versión actual**: 1.0.0-beta
