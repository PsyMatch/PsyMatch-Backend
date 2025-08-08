# PsyMatch Backend

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

## 📋 Descripción

**PsyMatch Backend** es una API REST robusta desarrollada con NestJS que facilita la conexión entre pacientes y psicólogos. La plataforma permite la gestión completa de usuarios, citas, historiales médicos, pagos y reseñas, proporcionando una solución integral para servicios de salud mental.

## ✨ Características Principales

- 🔐 **Autenticación y Autorización JWT** - Sistema seguro de login/registro
- 👥 **Gestión de Usuarios** - CRUD completo para pacientes y psicólogos
- 📅 **Sistema de Citas** - Programación y gestión de sesiones terapéuticas
- 📋 **Historiales Médicos** - Registro detallado de consultas y tratamientos
- 💳 **Gestión de Pagos** - Procesamiento seguro de transacciones
- ⭐ **Sistema de Reseñas** - Calificaciones y comentarios de servicios
- 🌍 **Geolocalización** - Integración con Google Maps para ubicaciones
- 📤 **Subida de Archivos** - Almacenamiento en Cloudinary para imágenes de perfil
- 📚 **Documentación Swagger** - API completamente documentada
- 🛡️ **Validación de Datos** - Validación exhaustiva con class-validator

## 🏗️ Arquitectura

### Módulos Principales

````
src/
├── assets/           # Recursos estáticos
├── common/           # Decoradores e interceptores
├── configs/          # Configuraciones de la app
└── modules/
    ├── auth/         # Autenticación y autorización
    ├── users/        # Gestión de usuarios
    ├── appointments/ # Sistema de citas
    ├── psychologist/ # Gestión de psicólogos
    ├── records/      # Historiales médicos
    ├── payments/     # Procesamiento de pagos
    ├── reviews/      # Sistema de reseñas
    ├── files/        # Manejo de archivos
    └── utils/        # Utilidades compartidas


### Stack Tecnológico

- **Framework**: NestJS
- **Lenguaje**: TypeScript
- **Base de Datos**: PostgreSQL
- **ORM**: TypeORM
- **Autenticación**: JWT + Passport
- **Validación**: class-validator + class-transformer
- **Documentación**: Swagger/OpenAPI
- **Almacenamiento**: Cloudinary
- **Containerización**: Docker

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js >= 18.0.0
- PostgreSQL >= 13
- Docker (opcional)

### Instalación Local

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd PsyMatch-Backend
````

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**

   ```bash
   cp .env.example .env
   ```

4. **Configurar la base de datos**

   ```bash
   # Ejecutar migraciones
   npm run migration:run
   ```

5. **Iniciar el servidor de desarrollo**
   ```bash
   npm run start:dev
   ```

### Instalación con Docker

```bash
# Construir y ejecutar contenedores
npm run docker:up

# Ver logs
npm run docker:logs

# Detener contenedores
npm run docker:down
```

## ⚙️ Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
# Servidor
NODE_ENV=development
PORT=3000
HOST=localhost

# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=psymatch_db
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_SSL=false

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google OAuth (opcional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## 📡 API Endpoints

### Autenticación

- `POST /auth/signup` - Registro de usuario
- `POST /auth/signin` - Inicio de sesión
- `POST /auth/google` - Autenticación con Google

### Usuarios

- `GET /users` - Obtener todos los usuarios
- `GET /users/:id` - Obtener usuario por ID
- `PUT /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario
- `POST /users/:id/profile-picture` - Subir foto de perfil

### Psicólogos

- `GET /psychologist` - Obtener todos los psicólogos
- `GET /psychologist/:id` - Obtener psicólogo por ID
- `PUT /psychologist/:id/validate` - Validar cuenta de psicólogo

### Citas

- `POST /appointments` - Crear cita
- `GET /appointments` - Obtener citas
- `PUT /appointments/:id` - Actualizar cita
- `DELETE /appointments/:id` - Cancelar cita

### Historiales

- `POST /records` - Crear historial
- `GET /records` - Obtener historiales
- `PUT /records/:id` - Actualizar historial

### Pagos

- `POST /payments` - Procesar pago
- `GET /payments` - Obtener pagos
- `PUT /payments/:id` - Actualizar estado de pago

### Reseñas

- `POST /reviews` - Crear reseña
- `GET /reviews` - Obtener reseñas
- `PUT /reviews/:id` - Actualizar reseña

## 📖 Documentación de la API

La documentación completa de la API está disponible en:

```
http://localhost:3000/api
```

## 🗄️ Esquema de Base de Datos

### Entidades Principales

- **User**: Información de usuarios (pacientes)
- **Psychologist**: Datos específicos de psicólogos
- **Appointment**: Citas programadas
- **Record**: Historiales médicos
- **Payment**: Transacciones de pago
- **Review**: Reseñas y calificaciones

### Características de los Datos

- **Geolocalización**: Campos de latitud y longitud para integración con Google Maps
- **Validación Argentina**: Formato de fechas DD-MM-YYYY y validación de DNI
- **Seguridad**: Contraseñas encriptadas con bcrypt
- **Relaciones**: Asociaciones complejas entre entidades

## 🧪 Scripts de Desarrollo

```bash
# Desarrollo
npm run start:dev        # Servidor con recarga automática
npm run start:debug      # Modo debug

# Construcción
npm run build           # Compilar aplicación
npm run start:prod      # Servidor de producción

# Calidad de Código
npm run lint            # Ejecutar ESLint
npm run format          # Formatear código con Prettier
npm run fix-imports     # Organizar imports

# Base de Datos
npm run migration:generate    # Generar migración
npm run migration:run        # Ejecutar migraciones
npm run migration:revert     # Revertir migración

# Docker
npm run docker:up       # Levantar contenedores
npm run docker:down     # Bajar contenedores
npm run docker:logs     # Ver logs
npm run docker:restart  # Reiniciar contenedores
```

## 🔐 Seguridad

- **Autenticación JWT** con tokens de larga duración
- **Validación de datos** exhaustiva en todos los endpoints
- **Autorización basada en roles** (Paciente, Psicólogo, Admin)
- **Protección CORS** configurada
- **Sanitización de datos** automática
- **Validación de archivos** para uploads seguros

## 🌍 Localización Argentina

- **Formato de fechas**: DD-MM-YYYY
- **Validación de teléfonos**: Formato internacional argentino
- **Validación de DNI**: Números de documento argentinos
- **Números de obra social**: Sistema de seguridad social

## 📋 Estado del Proyecto

- ✅ Autenticación y autorización
- ✅ CRUD completo de usuarios
- ✅ Sistema de archivos con Cloudinary
- ✅ Geolocalización integrada
- ✅ Documentación Swagger completa
- ✅ Validaciones exhaustivas
- ✅ Sistema de roles y permisos

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y no tiene licencia pública.

## 👥 Equipo de Desarrollo

Desarrollado por el equipo de PsyMatch para conectar pacientes con profesionales de la salud mental.

---

Para más información o soporte, contacta al equipo de desarrollo.
