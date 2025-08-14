# Módulo de Usuarios (Users)

## Descripción General

El módulo de **Users** es el núcleo del sistema PsyMatch que gestiona toda la información básica de usuarios mediante un patrón de Single Table Inheritance (STI). Este módulo proporciona la base para todos los tipos de usuarios (pacientes, psicólogos y administradores) y maneja operaciones CRUD fundamentales, autenticación OAuth, y gestión de perfiles.

## Funcionalidades Principales

### 👥 Gestión de Usuarios Base

- **Single Table Inheritance**: Un solo esquema para todos los roles de usuario
- **Autenticación OAuth**: Integración con Google OAuth2 para registro/login
- **Gestión de perfiles**: Actualización completa de información personal
- **Geolocalización**: Manejo de coordenadas para ubicación de usuarios

### 🔐 Control de Acceso y Seguridad

- **Autorización granular**: Control de acceso basado en roles
- **Soft delete**: Eliminación lógica preservando integridad referencial
- **Validación robusta**: DTOs con validaciones exhaustivas
- **Encriptación de contraseñas**: Manejo seguro de credenciales

### 📊 Categorización por Roles

- **Pacientes**: Información médica, obra social, contacto de emergencia
- **Psicólogos**: Datos profesionales, especialidades, verificación
- **Administradores**: Control total del sistema

## Arquitectura del Módulo

### 📁 Estructura de Archivos

```
users/
├── users.controller.ts         # Controlador REST API
├── users.service.ts            # Lógica de negocio
├── users.module.ts             # Configuración del módulo
├── dto/
│   ├── update-user.dto.ts      # DTO para actualización de usuarios
│   └── response-user.dto.ts    # DTO para respuestas de API
├── entities/
│   ├── user.entity.ts          # Entidad base con STI
│   ├── patient.entity.ts       # Entidad específica de pacientes
│   └── admin.entity.ts         # Entidad específica de administradores
└── enums/
    └── insurances.enum.ts      # Enum de obras sociales
```

## Esquema de Base de Datos

### 🏛️ Single Table Inheritance (STI)

```sql
CREATE TYPE role_enum AS ENUM ('Paciente', 'Psicólogo', 'Administrador');
CREATE TYPE insurance_enum AS ENUM (
    'OSDE', 'Swiss Medical', 'IOMA', 'PAMI', 'Unión Personal',
    'OSDEPYM', 'Luis Pasteur', 'Jerárquicos Salud', 'Sancor Salud',
    'OSECAC', 'OSMECON Salud', 'Apross', 'OSPRERA', 'OSPAT',
    'ASE Nacional', 'OSPIP'
);

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
    role role_enum NOT NULL DEFAULT 'Paciente',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    provider TEXT,               -- OAuth provider (google)
    provider_id TEXT,            -- OAuth provider user ID

    -- Campos específicos de Pacientes
    address TEXT,                -- Solo para pacientes
    health_insurance insurance_enum, -- Solo para pacientes
    emergency_contact TEXT,      -- Solo para pacientes

    -- Campos específicos de Psicólogos (heredados de psychologist module)
    personal_biography TEXT,
    languages TEXT[],
    professional_title TEXT,
    professional_experience INTEGER,
    license_number BIGINT,
    verified TEXT DEFAULT 'Pendiente',
    office_address TEXT,
    specialities TEXT[],
    therapy_approaches TEXT[],
    session_types TEXT[],
    modality TEXT,
    insurance_accepted TEXT[],
    availability TEXT[],

    CONSTRAINT chk_role_specific_fields CHECK (
        (role = 'Paciente' AND personal_biography IS NULL) OR
        (role = 'Psicólogo' AND address IS NULL) OR
        (role = 'Administrador')
    )
);

-- Índices para performance
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(is_active);
CREATE INDEX idx_users_provider ON users(provider, provider_id);
CREATE INDEX idx_users_location ON users(latitude, longitude);
CREATE INDEX idx_users_insurance ON users(health_insurance);
```

### 🔗 Relaciones

- **One-to-Many con Appointments**: Un usuario (paciente) puede tener múltiples citas
- **One-to-Many con Records**: Un usuario puede tener múltiples registros médicos
- **One-to-Many con Reviews**: Un usuario puede escribir múltiples reseñas
- **OAuth Integration**: Campos `provider` y `provider_id` para autenticación externa

## API Endpoints

### 🔹 GET `/users` - Obtener Todos los Usuarios (Solo Admin)

**Descripción**: Obtiene lista paginada de todos los usuarios del sistema.

**Roles permitidos**: `ADMIN`

**Query Parameters**:

- `page` (number, optional): Número de página (default: 1)
- `limit` (number, optional): Elementos por página (default: 10)

**Response** (200):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Lista de usuarios recuperada exitosamente",
  "data": [
    {
      "id": "user-uuid-1",
      "name": "Juan Carlos Pérez",
      "email": "juan.perez@email.com",
      "phone": "+5411123456789",
      "birthdate": "1985-03-15",
      "dni": 12345678,
      "role": "Paciente",
      "profile_picture": "https://cloudinary.com/profile.jpg",
      "latitude": -34.6037,
      "longitude": -58.3816,
      "is_active": true,
      "created_at": "2024-03-01T10:00:00Z",
      "updated_at": "2024-03-15T14:30:00Z",
      "last_login": "2024-03-15T09:15:00Z",

      // Campos específicos de paciente
      "address": "Av. Corrientes 1234, Buenos Aires",
      "health_insurance": "OSDE",
      "emergency_contact": "María Pérez - +5411987654321 - Madre",

      // Relaciones (si es paciente)
      "psychologists": [
        {
          "id": "psychologist-uuid",
          "name": "Dr. Ana García",
          "email": "ana.garcia@psychologist.com",
          "role": "Psicólogo"
        }
      ]
    },
    {
      "id": "user-uuid-2",
      "name": "Dr. Ana García",
      "email": "ana.garcia@psychologist.com",
      "phone": "+5411987654321",
      "role": "Psicólogo",
      "profile_picture": "https://cloudinary.com/ana-profile.jpg",
      "is_active": true,

      // Campos específicos de psicólogo
      "personal_biography": "Psicóloga especializada en terapia cognitivo-conductual con 8 años de experiencia...",
      "languages": ["Español", "Inglés"],
      "professional_title": "Licenciada en Psicología",
      "professional_experience": 8,
      "license_number": 87654321,
      "verified": "Validado",
      "office_address": "Av. Santa Fe 2000, Buenos Aires",
      "specialities": ["Trastorno de ansiedad", "Depresión"],
      "therapy_approaches": ["Terapia cognitivo-conductual"],
      "session_types": ["Individual", "Pareja"],
      "modality": "Híbrido",
      "insurance_accepted": ["OSDE", "Swiss Medical"],
      "availability": ["Lunes", "Martes", "Miércoles"]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 23,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### 🔹 GET `/users/patients` - Obtener Solo Pacientes (Solo Admin)

**Descripción**: Obtiene lista paginada solo de usuarios con rol de paciente.

**Roles permitidos**: `ADMIN`

**Query Parameters**:

- `page` (number, optional): Número de página
- `limit` (number, optional): Elementos por página

**Response** (200):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Lista de pacientes recuperada exitosamente",
  "data": [
    {
      "id": "patient-uuid-1",
      "name": "Juan Carlos Pérez",
      "email": "juan.perez@email.com",
      "phone": "+5411123456789",
      "birthdate": "1985-03-15",
      "dni": 12345678,
      "role": "Paciente",
      "profile_picture": "https://cloudinary.com/profile.jpg",
      "address": "Av. Corrientes 1234, Buenos Aires",
      "health_insurance": "OSDE",
      "emergency_contact": "María Pérez - +5411987654321 - Madre",
      "latitude": -34.6037,
      "longitude": -58.3816,
      "is_active": true,
      "created_at": "2024-03-01T10:00:00Z",
      "last_login": "2024-03-15T09:15:00Z",
      "psychologists": [
        {
          "id": "psychologist-uuid",
          "name": "Dr. Ana García",
          "email": "ana.garcia@psychologist.com",
          "role": "Psicólogo"
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "totalPages": 2,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### 🔹 GET `/users/:id` - Obtener Usuario por ID

**Descripción**: Obtiene información detallada de un usuario específico.

**Roles permitidos**: `ADMIN`, Usuario propietario

**Control de Acceso**:

- **Admin**: Puede ver cualquier usuario
- **Usuario**: Solo puede ver su propio perfil

**Response** (200):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Usuario encontrado exitosamente",
  "data": {
    "id": "user-uuid",
    "name": "Juan Carlos Pérez",
    "email": "juan.perez@email.com",
    "phone": "+5411123456789",
    "birthdate": "1985-03-15",
    "dni": 12345678,
    "role": "Paciente",
    "profile_picture": "https://cloudinary.com/profile.jpg",
    "address": "Av. Corrientes 1234, Buenos Aires",
    "health_insurance": "OSDE",
    "emergency_contact": "María Pérez - +5411987654321 - Madre",
    "latitude": -34.6037,
    "longitude": -58.3816,
    "is_active": true,
    "created_at": "2024-03-01T10:00:00Z",
    "updated_at": "2024-03-15T14:30:00Z",
    "last_login": "2024-03-15T09:15:00Z",
    "provider": "google",
    "provider_id": "google-oauth-id-123"
  }
}
```

### 🔹 PUT `/users/:id` - Actualizar Usuario

**Descripción**: Actualiza información de un usuario específico.

**Roles permitidos**: `ADMIN`, Usuario propietario

**Content-Type**: `multipart/form-data` (para foto de perfil)

**Request Body**:

```json
{
  "name": "Juan Carlos Pérez Actualizado",
  "phone": "+5411987654321",
  "birthdate": "1985-03-15",
  "address": "Av. Santa Fe 2000, Buenos Aires",
  "health_insurance": "Swiss Medical",
  "emergency_contact": "Ana Pérez - +5411555666777 - Esposa",
  "latitude": -34.5975,
  "longitude": -58.3816,
  "password": "NewSecurePassword123!"
}
```

**Validaciones**:

- `name`: 1-100 caracteres
- `phone`: Formato internacional (+5411123456789), 8-15 dígitos, único
- `birthdate`: Formato ISO date (YYYY-MM-DD)
- `address`: 3-200 caracteres
- `emergency_contact`: 1-255 caracteres
- `email`: Formato válido, único
- `password`: Mínimo 6 caracteres, al menos 1 minúscula, 1 mayúscula, 1 número, 1 carácter especial
- `health_insurance`: Enum de obras sociales válidas
- `latitude`: -90 a 90
- `longitude`: -180 a 180

**Response** (200):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Usuario actualizado exitosamente",
  "data": {
    "id": "user-uuid"
  }
}
```

### 🔹 DELETE `/users/:id` - Eliminar Usuario (Soft Delete)

**Descripción**: Elimina lógicamente un usuario (marca como inactivo).

**Roles permitidos**: `ADMIN`, Usuario propietario

**Response** (200):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Usuario eliminado exitosamente",
  "data": {
    "id": "user-uuid"
  }
}
```

## Integración con Frontend (Next.js)

### 🔧 Cliente de Usuarios

```typescript
// lib/users.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const usersApi = {
  // Obtener todos los usuarios (solo admin)
  getAllUsers: async (token: string, page = 1, limit = 10) => {
    const response = await fetch(
      `${API_BASE_URL}/users?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error('Error fetching users');
    }

    return response.json();
  },

  // Obtener solo pacientes (solo admin)
  getAllPatients: async (token: string, page = 1, limit = 10) => {
    const response = await fetch(
      `${API_BASE_URL}/users/patients?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error('Error fetching patients');
    }

    return response.json();
  },

  // Obtener usuario por ID
  getUserById: async (userId: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error fetching user');
    }

    return response.json();
  },

  // Actualizar usuario
  updateUser: async (
    userId: string,
    userData: UpdateUserData,
    token: string,
  ) => {
    const formData = new FormData();

    // Agregar campos de texto
    Object.keys(userData).forEach((key) => {
      if (key !== 'profile_picture' && userData[key] !== undefined) {
        formData.append(key, userData[key].toString());
      }
    });

    // Agregar archivo si existe
    if (userData.profile_picture instanceof File) {
      formData.append('profile_picture', userData.profile_picture);
    }

    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error updating user');
    }

    return response.json();
  },

  // Eliminar usuario
  deleteUser: async (userId: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error deleting user');
    }

    return response.json();
  },
};

// Tipos TypeScript
export interface UpdateUserData {
  name?: string;
  phone?: string;
  birthdate?: string;
  address?: string;
  health_insurance?: string;
  emergency_contact?: string;
  email?: string;
  latitude?: number;
  longitude?: number;
  password?: string;
  profile_picture?: File | string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  birthdate?: string;
  dni?: number;
  role: 'Paciente' | 'Psicólogo' | 'Administrador';
  profile_picture?: string;
  address?: string;
  health_insurance?: string;
  emergency_contact?: string;
  latitude?: number;
  longitude?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
  provider?: string;
  provider_id?: string;
}

export interface PaginatedUsers {
  data: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
```

### 📝 Componente de Perfil de Usuario

```typescript
// components/UserProfile.tsx
'use client';

import { useState, useEffect } from 'react';
import { usersApi } from '../lib/users';
import { useAuth } from '../context/AuthContext';
import Image from 'next/image';

interface UserProfileProps {
  userId: string;
  isEditable?: boolean;
}

const INSURANCE_OPTIONS = [
  'OSDE', 'Swiss Medical', 'IOMA', 'PAMI', 'Unión Personal',
  'OSDEPYM', 'Luis Pasteur', 'Jerárquicos Salud', 'Sancor Salud',
  'OSECAC', 'OSMECON Salud', 'Apross', 'OSPRERA', 'OSPAT',
  'ASE Nacional', 'OSPIP'
];

export default function UserProfile({ userId, isEditable = false }: UserProfileProps) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await usersApi.getUserById(userId, token);
      setUser(response.data);
      setFormData(response.data);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Solo se permiten archivos JPG, PNG y WEBP');
        return;
      }

      // Validar tamaño (2MB máximo)
      if (file.size > 2 * 1024 * 1024) {
        alert('El archivo debe ser menor a 2MB');
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const updateData = { ...formData };
      if (selectedFile) {
        updateData.profile_picture = selectedFile;
      }

      await usersApi.updateUser(userId, updateData, token);

      alert('Perfil actualizado exitosamente');
      setEditing(false);
      setSelectedFile(null);
      await fetchUser(); // Refrescar datos

    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Administrador': return 'bg-red-100 text-red-800';
      case 'Psicólogo': return 'bg-blue-100 text-blue-800';
      case 'Paciente': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const canEdit = isEditable && (
    currentUser?.role === 'Administrador' ||
    currentUser?.id === userId
  );

  if (loading) return <div>Cargando perfil...</div>;
  if (!user) return <div>Usuario no encontrado</div>;

  return (
    <div className="user-profile bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Image
              src={user.profile_picture || '/person-gray-photo-placeholder-woman.webp'}
              alt={user.name}
              width={80}
              height={80}
              className="rounded-full object-cover"
            />
            {editing && (
              <label className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1 cursor-pointer">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
              {user.role}
            </span>
            <p className="text-gray-600 mt-1">{user.email}</p>
          </div>
        </div>

        {canEdit && (
          <div className="space-x-2">
            {editing ? (
              <>
                <button
                  onClick={() => setEditing(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Editar Perfil
              </button>
            )}
          </div>
        )}
      </div>

      {/* Información Personal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Información Personal</h3>

          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
            {editing ? (
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="mt-1 text-gray-900">{user.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            {editing ? (
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="mt-1 text-gray-900">{user.email}</p>
            )}
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Teléfono</label>
            {editing ? (
              <input
                type="tel"
                name="phone"
                value={formData.phone || ''}
                onChange={handleInputChange}
                placeholder="+5411123456789"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="mt-1 text-gray-900">{user.phone || 'No especificado'}</p>
            )}
          </div>

          {/* Fecha de nacimiento */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
            {editing ? (
              <input
                type="date"
                name="birthdate"
                value={formData.birthdate?.split('T')[0] || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="mt-1 text-gray-900">
                {user.birthdate ? new Date(user.birthdate).toLocaleDateString('es-ES') : 'No especificado'}
              </p>
            )}
          </div>

          {/* DNI */}
          {user.dni && (
            <div>
              <label className="block text-sm font-medium text-gray-700">DNI</label>
              <p className="mt-1 text-gray-900">{user.dni.toLocaleString('es-ES')}</p>
            </div>
          )}
        </div>

        {/* Información Específica por Rol */}
        <div className="space-y-4">
          {user.role === 'Paciente' && (
            <>
              <h3 className="text-lg font-semibold text-gray-900">Información Médica</h3>

              {/* Dirección */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Dirección</label>
                {editing ? (
                  <input
                    type="text"
                    name="address"
                    value={formData.address || ''}
                    onChange={handleInputChange}
                    placeholder="Av. Corrientes 1234, Buenos Aires"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{user.address || 'No especificado'}</p>
                )}
              </div>

              {/* Obra Social */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Obra Social</label>
                {editing ? (
                  <select
                    name="health_insurance"
                    value={formData.health_insurance || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar obra social</option>
                    {INSURANCE_OPTIONS.map(insurance => (
                      <option key={insurance} value={insurance}>{insurance}</option>
                    ))}
                  </select>
                ) : (
                  <p className="mt-1 text-gray-900">{user.health_insurance || 'No especificado'}</p>
                )}
              </div>

              {/* Contacto de Emergencia */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Contacto de Emergencia</label>
                {editing ? (
                  <input
                    type="text"
                    name="emergency_contact"
                    value={formData.emergency_contact || ''}
                    onChange={handleInputChange}
                    placeholder="Nombre - Teléfono - Relación"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{user.emergency_contact || 'No especificado'}</p>
                )}
              </div>
            </>
          )}

          {user.role === 'Psicólogo' && (
            <>
              <h3 className="text-lg font-semibold text-gray-900">Información Profesional</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700">Título Profesional</label>
                <p className="mt-1 text-gray-900">{user.professional_title || 'No especificado'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Experiencia</label>
                <p className="mt-1 text-gray-900">
                  {user.professional_experience ? `${user.professional_experience} años` : 'No especificado'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Estado de Verificación</label>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  user.verified === 'Validado' ? 'bg-green-100 text-green-800' :
                  user.verified === 'Rechazado' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {user.verified || 'Pendiente'}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Metadatos */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Metadatos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
          <div>
            <span className="font-medium">Registrado:</span>
            <p>{new Date(user.created_at).toLocaleDateString('es-ES')}</p>
          </div>
          <div>
            <span className="font-medium">Última actualización:</span>
            <p>{new Date(user.updated_at).toLocaleDateString('es-ES')}</p>
          </div>
          {user.last_login && (
            <div>
              <span className="font-medium">Último acceso:</span>
              <p>{new Date(user.last_login).toLocaleDateString('es-ES')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Cambio de contraseña para usuarios propios */}
      {editing && currentUser?.id === userId && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cambiar Contraseña</h3>
          <div className="max-w-md">
            <input
              type="password"
              name="password"
              value={formData.password || ''}
              onChange={handleInputChange}
              placeholder="Nueva contraseña (mínimo 6 caracteres)"
              className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Debe contener al menos 1 minúscula, 1 mayúscula, 1 número y 1 carácter especial
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
```

### 📊 Componente de Lista de Usuarios (Admin)

```typescript
// components/UsersList.tsx
'use client';

import { useState, useEffect } from 'react';
import { usersApi } from '../lib/users';
import { useAuth } from '../context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';

interface UsersListProps {
  patientsOnly?: boolean;
}

export default function UsersList({ patientsOnly = false }: UsersListProps) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const { user } = useAuth();

  const limit = 12; // Usuarios por página

  useEffect(() => {
    if (user?.role === 'Administrador') {
      fetchUsers();
    }
  }, [currentPage, user]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = patientsOnly
        ? await usersApi.getAllPatients(token, currentPage, limit)
        : await usersApi.getAllUsers(token, currentPage, limit);

      setUsers(response.data || []);
      setPagination(response.pagination);
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(userItem => {
    const matchesSearch = userItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         userItem.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || userItem.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Administrador': return 'bg-red-100 text-red-800';
      case 'Psicólogo': return 'bg-blue-100 text-blue-800';
      case 'Paciente': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  if (user?.role !== 'Administrador') {
    return <div className="text-red-600">Acceso denegado. Solo administradores.</div>;
  }

  if (loading) return <div>Cargando usuarios...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div className="users-list">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {patientsOnly ? 'Lista de Pacientes' : 'Lista de Usuarios'}
        </h2>

        <div className="flex space-x-4">
          {/* Búsqueda */}
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-64"
          />

          {/* Filtro por rol */}
          {!patientsOnly && (
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">Todos los roles</option>
              <option value="Paciente">Pacientes</option>
              <option value="Psicólogo">Psicólogos</option>
              <option value="Administrador">Administradores</option>
            </select>
          )}
        </div>
      </div>

      {/* Estadísticas */}
      {pagination && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">{pagination.total}</div>
              <div className="text-sm text-gray-600">Total de usuarios</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {users.filter(u => u.is_active).length}
              </div>
              <div className="text-sm text-gray-600">Activos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {users.filter(u => !u.is_active).length}
              </div>
              <div className="text-sm text-gray-600">Inactivos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{filteredUsers.length}</div>
              <div className="text-sm text-gray-600">Mostrando</div>
            </div>
          </div>
        </div>
      )}

      {/* Lista de usuarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((userItem: any) => (
          <div key={userItem.id} className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              <Image
                src={userItem.profile_picture || '/person-gray-photo-placeholder-woman.webp'}
                alt={userItem.name}
                width={50}
                height={50}
                className="rounded-full object-cover"
              />

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {userItem.name}
                </h3>
                <p className="text-sm text-gray-600 truncate">{userItem.email}</p>

                <div className="flex items-center space-x-2 mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(userItem.role)}`}>
                    {userItem.role}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(userItem.is_active)}`}>
                    {userItem.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>

                {/* Información específica */}
                <div className="mt-3 text-sm text-gray-600">
                  {userItem.role === 'Paciente' && userItem.health_insurance && (
                    <p><strong>Obra Social:</strong> {userItem.health_insurance}</p>
                  )}
                  {userItem.role === 'Psicólogo' && userItem.verified && (
                    <p><strong>Verificación:</strong> {userItem.verified}</p>
                  )}
                  {userItem.phone && (
                    <p><strong>Teléfono:</strong> {userItem.phone}</p>
                  )}
                </div>

                {/* Fecha de registro */}
                <p className="text-xs text-gray-500 mt-2">
                  Registrado: {new Date(userItem.created_at).toLocaleDateString('es-ES')}
                </p>

                {/* Último acceso */}
                {userItem.last_login && (
                  <p className="text-xs text-gray-500">
                    Último acceso: {new Date(userItem.last_login).toLocaleDateString('es-ES')}
                  </p>
                )}
              </div>
            </div>

            {/* Acciones */}
            <div className="mt-4 flex justify-end space-x-2">
              <Link
                href={`/dashboard/users/${userItem.id}`}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
              >
                Ver Perfil
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Paginación */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={!pagination.hasPrev}
            className="bg-gray-200 text-gray-700 px-3 py-2 rounded disabled:opacity-50"
          >
            Anterior
          </button>

          <span className="text-gray-600">
            Página {pagination.page} de {pagination.totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
            disabled={!pagination.hasNext}
            className="bg-gray-200 text-gray-700 px-3 py-2 rounded disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Estado vacío */}
      {filteredUsers.length === 0 && !loading && (
        <div className="text-center text-gray-500 py-8">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
          <p>No hay usuarios que coincidan con los criterios de búsqueda</p>
          <p className="text-sm text-gray-400">Intenta ajustar los filtros o términos de búsqueda</p>
        </div>
      )}
    </div>
  );
}
```

### 🔄 Hook para Gestión de Usuarios

```typescript
// hooks/useUsers.ts
import { useState, useEffect } from 'react';
import { usersApi } from '../lib/users';
import { useAuth } from '../context/AuthContext';

export function useUsers(patientsOnly = false) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const { user } = useAuth();

  const fetchUsers = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = patientsOnly
        ? await usersApi.getAllPatients(token, page, limit)
        : await usersApi.getAllUsers(token, page, limit);

      setUsers(response.data || []);
      setPagination(response.pagination);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userId: string, userData: any) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('No authenticated');

      const updatedUser = await usersApi.updateUser(userId, userData, token);

      // Actualizar la lista local
      setUsers((prev) =>
        prev.map((userItem) =>
          userItem.id === userId
            ? { ...userItem, ...userData, updated_at: new Date().toISOString() }
            : userItem,
        ),
      );

      return updatedUser;
    } catch (err) {
      throw err;
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('No authenticated');

      await usersApi.deleteUser(userId, token);

      // Marcar como inactivo en la lista local
      setUsers((prev) =>
        prev.map((userItem) =>
          userItem.id === userId ? { ...userItem, is_active: false } : userItem,
        ),
      );
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    if (user?.role === 'Administrador') {
      fetchUsers();
    }
  }, [user, patientsOnly]);

  return {
    users,
    loading,
    error,
    pagination,
    refetch: fetchUsers,
    updateUser,
    deleteUser,
  };
}

// Hook para un usuario específico
export function useUser(userId: string) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await usersApi.getUserById(userId, token);
      setUser(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userData: any) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('No authenticated');

      const updatedUser = await usersApi.updateUser(userId, userData, token);

      // Actualizar el usuario local
      setUser((prev) => ({
        ...prev,
        ...userData,
        updated_at: new Date().toISOString(),
      }));

      return updatedUser;
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  return {
    user,
    loading,
    error,
    refetch: fetchUser,
    updateUser,
  };
}
```

## Enums y Tipos

### 🏥 Obras Sociales (Insurances)

```typescript
export enum EInsurance {
  OSDE = 'OSDE',
  SWISS_MEDICAL = 'Swiss Medical',
  IOMA = 'IOMA',
  PAMI = 'PAMI',
  UNION_PERSONAL = 'Unión Personal',
  OSDEPYM = 'OSDEPYM',
  LUIS_PASTEUR = 'Luis Pasteur',
  JERARQUICOS_SALUD = 'Jerárquicos Salud',
  SANCOR_SALUD = 'Sancor Salud',
  OSECAC = 'OSECAC',
  OSMECON_SALUD = 'OSMECON Salud',
  APROSS = 'Apross',
  OSPRERA = 'OSPRERA',
  OSPAT = 'OSPAT',
  SENACIONAL = 'ASE Nacional',
  OSPIP = 'OSPIP',
}
```

## Validaciones y Reglas de Negocio

### 📋 Validaciones del DTO

```typescript
export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'El nombre debe ser un string.' })
  @Length(1, 100, { message: 'El nombre debe tener entre 1 y 100 caracteres.' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'El teléfono debe ser un string.' })
  @Matches(/^(\+?[1-9]\d{1,14})$/, {
    message: 'El teléfono debe ser un número válido (ej., +5411123456789)',
  })
  @Length(8, 15, { message: 'El teléfono debe tener entre 8 y 15 dígitos.' })
  phone?: string;

  @IsOptional()
  @IsDateString(
    {},
    { message: 'La fecha de nacimiento debe ser una fecha válida' },
  )
  birthdate?: Date;

  @IsOptional()
  @IsEnum(EInsurance, {
    message: 'La obra social debe ser un proveedor válido',
  })
  health_insurance?: EInsurance;

  @IsOptional()
  @IsString({ message: 'La dirección debe ser un string.' })
  @Length(3, 200, {
    message: 'La dirección debe tener entre 3 y 200 caracteres.',
  })
  address?: string;

  @IsOptional()
  @IsString({ message: 'El email debe ser un string.' })
  @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
    message: 'El email debe ser una dirección de correo válida',
  })
  email?: string;

  @IsOptional()
  @IsString({ message: 'La contraseña debe ser un string.' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  @Matches(
    /^(?=.*[\p{Ll}])(?=.*[\p{Lu}])(?=.*\d)[\p{L}\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{6,}$/u,
    {
      message:
        'La contraseña debe contener al menos una letra minúscula, una mayúscula, un número y un carácter especial',
    },
  )
  password?: string;
}
```

### 🔒 Control de Acceso

- **GET /users**: Solo `ADMIN`
- **GET /users/patients**: Solo `ADMIN`
- **GET /users/:id**: `ADMIN` o usuario propietario
- **PUT /users/:id**: `ADMIN` o usuario propietario
- **DELETE /users/:id**: `ADMIN` o usuario propietario

### 🚫 Restricciones de Seguridad

- Los usuarios no pueden cambiar su propio rol (excepto admin)
- El teléfono debe ser único en el sistema
- El email debe ser único en el sistema
- Solo soft delete para preservar integridad referencial
- Validación de formato de archivos de imagen (JPG, PNG, WEBP)
- Límite de tamaño de archivo de 2MB para fotos de perfil

## Consideraciones de Producción

### 🚀 Optimizaciones

```sql
-- Índices para performance
CREATE INDEX idx_users_role_active ON users(role, is_active);
CREATE INDEX idx_users_email_active ON users(email, is_active);
CREATE INDEX idx_users_phone_active ON users(phone, is_active);
CREATE INDEX idx_users_provider_auth ON users(provider, provider_id);

-- Índice parcial para usuarios activos
CREATE INDEX idx_users_active_only ON users(id) WHERE is_active = true;

-- Índice para búsquedas de texto
CREATE INDEX idx_users_name_trgm ON users USING gin(name gin_trgm_ops);
CREATE INDEX idx_users_email_trgm ON users USING gin(email gin_trgm_ops);
```

### 📈 Métricas de Monitoreo

```typescript
const userMetrics = {
  totalUsers: 'Total de usuarios registrados',
  activeUsers: 'Usuarios activos',
  usersByRole: 'Distribución por roles',
  registrationsThisMonth: 'Registros del mes actual',
  lastLoginActivity: 'Actividad de último acceso',
  oauthVsEmailUsers: 'Usuarios OAuth vs Email/Password',
  profileCompleteness: 'Completitud de perfiles',
};
```

### 🔐 Seguridad en Producción

```typescript
// Configuración de seguridad
const securityConfig = {
  passwordPolicy: {
    minLength: 6,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSymbols: true,
  },
  fileUpload: {
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    maxSize: 2 * 1024 * 1024, // 2MB
    virusScan: true,
  },
  rateLimiting: {
    updateProfile: '5 requests per minute',
    login: '10 requests per minute',
    fileUpload: '3 requests per minute',
  },
};
```

## Próximas Mejoras

- [ ] Sistema de verificación por email/SMS
- [ ] Autenticación de dos factores (2FA)
- [ ] Historial de cambios de perfil
- [ ] Exportación de datos de usuario (GDPR)
- [ ] Sistema de notificaciones push
- [ ] Integración con más proveedores OAuth (Facebook, Apple)
- [ ] Geolocalización automática basada en IP
- [ ] Dashboard de analytics de usuarios
- [ ] Sistema de badges y logros
- [ ] API de sincronización con sistemas externos
