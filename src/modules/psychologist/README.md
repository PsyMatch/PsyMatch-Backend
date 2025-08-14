# Módulo de Psicólogos (Psychologist)

## Descripción General

El módulo de **Psychologist** gestiona toda la funcionalidad relacionada con los profesionales de la salud mental en PsyMatch. Proporciona un sistema completo para la administración de perfiles profesionales, verificación de credenciales, gestión de pacientes, reseñas, citas y pagos específicos para psicólogos.

## Funcionalidades Principales

### 👨‍⚕️ Gestión de Perfiles Profesionales

- **Perfiles detallados**: Información completa del psicólogo (especialidades, enfoques, experiencia)
- **Verificación de credenciales**: Sistema de validación por administradores
- **Gestión de disponibilidad**: Control de horarios y modalidades de atención
- **Múltiples especialidades**: Soporte para diversas áreas de expertise

### 🔍 Sistema de Verificación

- **Estados de verificación**: Pendiente, validado, rechazado
- **Proceso administrativo**: Control por parte de administradores
- **Documentación**: Validación de títulos y licencias profesionales
- **Historial de verificación**: Seguimiento completo del proceso

### 📊 Dashboard Profesional

- **Gestión de pacientes**: Lista y seguimiento de pacientes activos
- **Administración de citas**: Control completo del calendario profesional
- **Gestión financiera**: Seguimiento de pagos y facturación
- **Reseñas y calificaciones**: Monitoreo de feedback de pacientes

## Estructura del Módulo

```
psychologist/
├── entities/
│   └── psychologist.entity.ts          # Entidad principal del psicólogo
├── dto/
│   ├── update-psychologist.dto.ts      # DTO para actualizar perfil
│   └── response-pending-psychologist.dto.ts  # DTO para respuestas
├── enums/
│   ├── specialities.enum.ts            # Especialidades psicológicas
│   ├── therapy-approaches.enum.ts      # Enfoques terapéuticos
│   ├── session-types.enum.ts          # Tipos de sesión
│   ├── modality.enum.ts               # Modalidades (presencial/virtual)
│   ├── languages.enum.ts              # Idiomas disponibles
│   ├── availability.enum.ts           # Horarios de disponibilidad
│   └── verified.enum.ts               # Estados de verificación
└── logic/
    ├── psychologist.module.ts          # Configuración del módulo
    ├── profileManagement/              # Gestión de perfiles
    ├── verificationOfProfessionals/    # Verificación de profesionales
    ├── reviewsOfProfessionals/         # Gestión de reseñas
    ├── paymentsOfProfessionals/        # Gestión financiera
    ├── patientsOfProfessional/         # Gestión de pacientes
    └── appointmentsOfProfessional/     # Gestión de citas
```

## Entidad Psychologist

### 🏛️ Esquema de Base de Datos

La entidad `Psychologist` extiende la entidad `User` usando Single Table Inheritance (STI):

```sql
-- Campos específicos de Psychologist en la tabla users
CREATE TABLE users (
    -- Campos base de User...

    -- Campos específicos de Psychologist
    personal_biography TEXT NOT NULL,
    languages psychologist_language_enum[] NOT NULL,
    professional_experience INTEGER NOT NULL,
    professional_title TEXT NOT NULL,
    license_number BIGINT UNIQUE NOT NULL,
    verified psychologist_status_enum NOT NULL,
    office_address TEXT,
    specialities psychologist_specialty_enum[] NOT NULL,
    therapy_approaches therapy_approach_enum[] NOT NULL,
    session_types session_type_enum[] NOT NULL,
    modality modality_enum NOT NULL,
    insurance_accepted insurance_enum[] NOT NULL,
    availability availability_enum[] NOT NULL
);
```

### 📊 Enums del Sistema

#### Especialidades Psicológicas

```typescript
export enum EPsychologistSpecialty {
  ANXIETY_DISORDER = 'Trastorno de ansiedad',
  COUPLES_THERAPY = 'Terapia de pareja',
  EATING_DISORDER = 'Trastorno de la alimentación',
  BIPOLAR_DISORDER = 'Trastorno bipolar',
  LIFE_TRANSITIONS = 'Transiciones de vida',
  CHILD_ADOLESCENT_THERAPY = 'Terapia infantil y adolescente',
  SLEEP_DISORDERS = 'Trastornos del sueño',
  DEPRESSION = 'Depresión',
  FAMILY_THERAPY = 'Terapia familiar',
  ADHD = 'TDAH',
  OCD = 'TOC',
  CAREER_COUNSELING = 'Orientación profesional',
  GERIATRIC_PS = 'Psicología geriátrica',
  ANGER_MANAGEMENT = 'Manejo de la ira',
  TRAUMA_PTSD = 'Trauma y TEPT',
  ADDICTION_SUBSTANCE_ABUSE = 'Adicción y abuso de sustancias',
  AUTISM_SPECTRUM_DISORDER = 'Trastorno del espectro autista',
  GRIEF_LOSS = 'Duelo y pérdida',
  LGBTQIA = 'LGBTQIA',
  CHRONIC_PAIN_MANAGEMENT = 'Manejo del dolor crónico',
}
```

#### Enfoques Terapéuticos

```typescript
export enum ETherapyApproach {
  COGNITIVE_BEHAVIORAL_THERAPY = 'Terapia cognitivo-conductual',
  ACCEPTANCE_COMMITMENT_THERAPY = 'Terapia de aceptación y compromiso',
  PSYCHODYNAMIC_THERAPY = 'Terapia psicodinámica',
  FAMILY_SYSTEMS_THERAPY = 'Terapia de sistemas familiares',
  SOLUTION_FOCUSED_BRIEF_THERAPY = 'Terapia breve centrada en soluciones',
  PLAY_THERAPY = 'Terapia de juego',
  DIALECTICAL_BEHAVIORAL_THERAPY = 'Terapia dialéctico-conductual',
  EYE_MOVEMENT_DESENSITIZATION_REPROCESSING = 'EMDR',
  HUMANISTIC_CENTRED_THERAPY = 'Terapia centrada en la persona',
  MINDFULNESS_BASED_THERAPY = 'Terapia basada en mindfulness',
  GESTALT_THERAPY = 'Terapia Gestalt',
  ART_THERAPY = 'Terapia de arte',
  GROUP_THERAPY = 'Terapia de grupo',
}
```

#### Estados de Verificación

```typescript
export enum EPsychologistStatus {
  PENDING = 'Pendiente', // Esperando verificación
  VALIDATED = 'Validado', // Verificado y activo
  REJECTED = 'Rechazado', // Rechazado por incumplimiento
}
```

## API Endpoints

### 🔹 Gestión de Perfiles

#### GET `/psychologist/me` - Obtener Perfil Propio

**Descripción**: Obtiene el perfil completo del psicólogo autenticado.

**Roles permitidos**: `PSYCHOLOGIST`

**Response** (200):

```json
{
  "id": "psychologist-uuid",
  "name": "Dr. Ana García",
  "email": "ana.garcia@psychologist.com",
  "phone": "+54 11 1234-5678",
  "personal_biography": "Especialista en terapia cognitivo-conductual con 8 años de experiencia...",
  "languages": ["SPANISH", "ENGLISH"],
  "professional_experience": 8,
  "professional_title": "Licenciada en Psicología",
  "license_number": 123456789,
  "verified": "VALIDATED",
  "office_address": "Av. Corrientes 1234, Oficina 302, Buenos Aires",
  "specialities": [
    "ANXIETY_DISORDER",
    "DEPRESSION",
    "COGNITIVE_BEHAVIORAL_THERAPY"
  ],
  "therapy_approaches": [
    "COGNITIVE_BEHAVIORAL_THERAPY",
    "MINDFULNESS_BASED_THERAPY"
  ],
  "session_types": ["INDIVIDUAL", "COUPLES"],
  "modality": "HYBRID",
  "insurance_accepted": ["OSDE", "SWISS_MEDICAL"],
  "availability": ["MORNING", "AFTERNOON"],
  "profile_picture": "https://cloudinary.com/profile.jpg",
  "created_at": "2024-01-15T10:00:00Z",
  "updated_at": "2024-03-15T14:30:00Z"
}
```

#### PUT `/psychologist/me` - Actualizar Perfil Propio

**Descripción**: Actualiza la información del perfil del psicólogo autenticado.

**Roles permitidos**: `PSYCHOLOGIST`

**Request Body**:

```json
{
  "personal_biography": "Actualizada biografía profesional...",
  "specialities": ["ANXIETY_DISORDER", "TRAUMA_PTSD"],
  "therapy_approaches": ["COGNITIVE_BEHAVIORAL_THERAPY", "EMDR"],
  "office_address": "Nueva dirección del consultorio",
  "availability": ["MORNING", "EVENING"],
  "insurance_accepted": ["OSDE", "SWISS_MEDICAL", "OMINT"]
}
```

**Response** (200):

```json
{
  "message": "Perfil actualizado exitosamente",
  "psychologist": {
    "id": "psychologist-uuid",
    "personal_biography": "Actualizada biografía profesional...",
    "specialities": ["ANXIETY_DISORDER", "TRAUMA_PTSD"],
    "updated_at": "2024-03-15T15:00:00Z"
  }
}
```

### 🔹 Sistema de Verificación

#### GET `/psychologist/verification` - Obtener Solicitudes Pendientes

**Descripción**: Obtiene todas las solicitudes de verificación pendientes (solo administradores).

**Roles permitidos**: `ADMIN`

**Query Parameters**:

- `page` (number): Número de página (default: 1)
- `limit` (number): Elementos por página (default: 10)

**Response** (200):

```json
{
  "data": [
    {
      "id": "psychologist-uuid",
      "name": "Dr. Carlos Mendez",
      "email": "carlos.mendez@psychologist.com",
      "license_number": 987654321,
      "professional_title": "Psicólogo Clínico",
      "office_address": "Av. Santa Fe 2000, CABA",
      "specialities": ["DEPRESSION", "ANXIETY_DISORDER"],
      "professional_experience": 5,
      "verified": "PENDING",
      "created_at": "2024-03-10T09:00:00Z",
      "documents": [
        {
          "type": "license",
          "url": "https://cloudinary.com/license.pdf"
        },
        {
          "type": "diploma",
          "url": "https://cloudinary.com/diploma.pdf"
        }
      ]
    }
  ],
  "totalItems": 25,
  "totalPages": 3,
  "currentPage": 1,
  "itemsPerPage": 10
}
```

#### PUT `/psychologist/verification/:id/validate` - Validar Psicólogo

**Descripción**: Valida las credenciales de un psicólogo pendiente.

**Roles permitidos**: `ADMIN`

**Parámetros**:

- `id` (string): UUID del psicólogo

**Response** (200):

```json
{
  "message": "Psicólogo validado exitosamente",
  "psychologist": {
    "id": "psychologist-uuid",
    "name": "Dr. Carlos Mendez",
    "verified": "VALIDATED",
    "validated_at": "2024-03-15T16:00:00Z"
  }
}
```

#### PUT `/psychologist/verification/:id/reject` - Rechazar Psicólogo

**Descripción**: Rechaza la solicitud de verificación de un psicólogo.

**Roles permitidos**: `ADMIN`

**Request Body**:

```json
{
  "reason": "Documentación incompleta o inválida"
}
```

**Response** (200):

```json
{
  "message": "Psicólogo rechazado",
  "psychologist": {
    "id": "psychologist-uuid",
    "verified": "REJECTED",
    "rejection_reason": "Documentación incompleta o inválida",
    "rejected_at": "2024-03-15T16:00:00Z"
  }
}
```

### 🔹 Gestión de Pacientes

#### GET `/psychologist/patients` - Obtener Pacientes

**Descripción**: Obtiene la lista de pacientes del psicólogo autenticado.

**Roles permitidos**: `PSYCHOLOGIST`

**Response** (200):

```json
{
  "data": [
    {
      "id": "patient-uuid",
      "name": "Juan Pérez",
      "email": "juan@email.com",
      "age": 28,
      "first_appointment": "2024-02-01T10:00:00Z",
      "last_appointment": "2024-03-10T15:00:00Z",
      "total_appointments": 6,
      "status": "ACTIVE",
      "notes": "Progreso satisfactorio en el tratamiento"
    }
  ],
  "totalItems": 15,
  "totalPages": 2,
  "currentPage": 1
}
```

### 🔹 Gestión de Citas

#### GET `/psychologist/appointments` - Obtener Citas del Psicólogo

**Descripción**: Obtiene todas las citas del psicólogo autenticado.

**Roles permitidos**: `PSYCHOLOGIST`

**Query Parameters**:

- `status` (string): Estado de la cita (optional)
- `date_from` (string): Fecha inicio (YYYY-MM-DD)
- `date_to` (string): Fecha fin (YYYY-MM-DD)
- `page` (number): Número de página

**Response** (200):

```json
{
  "data": [
    {
      "id": "appointment-uuid",
      "patient": {
        "id": "patient-uuid",
        "name": "María González",
        "email": "maria@email.com"
      },
      "date": "2024-03-20T14:00:00Z",
      "duration": 50,
      "modality": "VIRTUAL",
      "status": "CONFIRMED",
      "notes": "Sesión de seguimiento",
      "payment_status": "COMPLETED"
    }
  ],
  "totalItems": 45,
  "totalPages": 5,
  "currentPage": 1
}
```

### 🔹 Gestión Financiera

#### GET `/psychologist/payments` - Obtener Pagos del Psicólogo

**Descripción**: Obtiene el historial de pagos recibidos por el psicólogo.

**Roles permitidos**: `PSYCHOLOGIST`

**Response** (200):

```json
{
  "data": [
    {
      "payment_id": "payment-uuid",
      "appointment": {
        "id": "appointment-uuid",
        "date": "2024-03-15T10:00:00Z",
        "patient_name": "Ana López"
      },
      "amount": 150.0,
      "currency": "USD",
      "commission": 15.0,
      "net_amount": 135.0,
      "status": "COMPLETED",
      "created_at": "2024-03-15T10:30:00Z"
    }
  ],
  "summary": {
    "total_earned": 2700.0,
    "total_commission": 270.0,
    "net_earnings": 2430.0,
    "current_month": 450.0
  }
}
```

## Integración con Frontend (Next.js)

### 🔧 Cliente de Psicólogos

```typescript
// lib/psychologist.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const psychologistApi = {
  // Obtener perfil propio
  getMyProfile: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/psychologist/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error fetching profile');
    }

    return response.json();
  },

  // Actualizar perfil
  updateProfile: async (profileData: UpdatePsychologistData, token: string) => {
    const response = await fetch(`${API_BASE_URL}/psychologist/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error updating profile');
    }

    return response.json();
  },

  // Obtener pacientes
  getPatients: async (page: number = 1, token: string) => {
    const response = await fetch(
      `${API_BASE_URL}/psychologist/patients?page=${page}`,
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

  // Obtener citas
  getAppointments: async (filters: AppointmentFilters, token: string) => {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value.toString());
    });

    const response = await fetch(
      `${API_BASE_URL}/psychologist/appointments?${queryParams}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error('Error fetching appointments');
    }

    return response.json();
  },

  // Obtener pagos
  getPayments: async (page: number = 1, token: string) => {
    const response = await fetch(
      `${API_BASE_URL}/psychologist/payments?page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error('Error fetching payments');
    }

    return response.json();
  },
};

// Tipos TypeScript
export interface UpdatePsychologistData {
  personal_biography?: string;
  specialities?: string[];
  therapy_approaches?: string[];
  office_address?: string;
  availability?: string[];
  insurance_accepted?: string[];
  session_types?: string[];
}

export interface AppointmentFilters {
  status?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
}

export interface PsychologistProfile {
  id: string;
  name: string;
  email: string;
  personal_biography: string;
  languages: string[];
  professional_experience: number;
  professional_title: string;
  license_number: number;
  verified: 'PENDING' | 'VALIDATED' | 'REJECTED';
  office_address: string;
  specialities: string[];
  therapy_approaches: string[];
  session_types: string[];
  modality: string;
  insurance_accepted: string[];
  availability: string[];
  profile_picture?: string;
}
```

### 👨‍⚕️ Componente de Perfil Profesional

```typescript
// components/PsychologistProfile.tsx
'use client';

import { useState, useEffect } from 'react';
import { psychologistApi } from '../lib/psychologist';
import { useAuth } from '../context/AuthContext';

export default function PsychologistProfile() {
  const [profile, setProfile] = useState<PsychologistProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const data = await psychologistApi.getMyProfile(token);
      setProfile(data);
      setFormData(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      await psychologistApi.updateProfile(formData, token);
      setProfile(formData);
      setEditing(false);
      alert('Perfil actualizado exitosamente');
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const getVerificationBadge = (status: string) => {
    const badges = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', text: 'Pendiente de Verificación' },
      VALIDATED: { color: 'bg-green-100 text-green-800', text: 'Verificado' },
      REJECTED: { color: 'bg-red-100 text-red-800', text: 'Rechazado' }
    };

    const badge = badges[status] || badges.PENDING;

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  if (loading) return <div>Cargando perfil...</div>;
  if (!profile) return <div>Error cargando perfil</div>;

  return (
    <div className="psychologist-profile max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
              {profile.profile_picture ? (
                <img
                  src={profile.profile_picture}
                  alt={profile.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <span className="text-white text-2xl font-bold">
                  {profile.name.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
              <p className="text-gray-600">{profile.professional_title}</p>
              <p className="text-sm text-gray-500">Matrícula: {profile.license_number}</p>
              <div className="mt-2">
                {getVerificationBadge(profile.verified)}
              </div>
            </div>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            {editing ? 'Cancelar' : 'Editar Perfil'}
          </button>
        </div>
      </div>

      {/* Información Profesional */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Información Personal */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Información Personal</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Biografía Profesional</label>
              {editing ? (
                <textarea
                  value={formData.personal_biography || ''}
                  onChange={(e) => setFormData({...formData, personal_biography: e.target.value})}
                  rows={4}
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="mt-1 text-gray-600">{profile.personal_biography}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Experiencia</label>
              <p className="mt-1 text-gray-600">{profile.professional_experience} años</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Idiomas</label>
              <div className="mt-1 flex flex-wrap gap-2">
                {profile.languages.map(lang => (
                  <span key={lang} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Dirección del Consultorio</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.office_address || ''}
                  onChange={(e) => setFormData({...formData, office_address: e.target.value})}
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="mt-1 text-gray-600">{profile.office_address}</p>
              )}
            </div>
          </div>
        </div>

        {/* Especialidades y Enfoques */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Especialidades</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Especialidades</label>
              <div className="mt-1 flex flex-wrap gap-2">
                {profile.specialities.map(specialty => (
                  <span key={specialty} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {specialty.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Enfoques Terapéuticos</label>
              <div className="mt-1 flex flex-wrap gap-2">
                {profile.therapy_approaches.map(approach => (
                  <span key={approach} className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    {approach.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Tipos de Sesión</label>
              <div className="mt-1 flex flex-wrap gap-2">
                {profile.session_types.map(type => (
                  <span key={type} className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                    {type}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Modalidad</label>
              <p className="mt-1 text-gray-600">{profile.modality}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Obras Sociales</label>
              <div className="mt-1 flex flex-wrap gap-2">
                {profile.insurance_accepted.map(insurance => (
                  <span key={insurance} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {insurance}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Disponibilidad</label>
              <div className="mt-1 flex flex-wrap gap-2">
                {profile.availability.map(time => (
                  <span key={time} className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                    {time}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botón de Guardar */}
      {editing && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
          >
            Guardar Cambios
          </button>
        </div>
      )}
    </div>
  );
}
```

### 📊 Dashboard del Psicólogo

```typescript
// components/PsychologistDashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import { psychologistApi } from '../lib/psychologist';

export default function PsychologistDashboard() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    upcomingAppointments: 0,
    monthlyEarnings: 0,
    averageRating: 0
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      // Cargar datos en paralelo
      const [appointmentsData, paymentsData, patientsData] = await Promise.all([
        psychologistApi.getAppointments({ page: 1 }, token),
        psychologistApi.getPayments(1, token),
        psychologistApi.getPatients(1, token)
      ]);

      setStats({
        totalPatients: patientsData.totalItems || 0,
        upcomingAppointments: appointmentsData.data.filter(apt =>
          new Date(apt.date) > new Date() && apt.status === 'CONFIRMED'
        ).length,
        monthlyEarnings: paymentsData.summary?.current_month || 0,
        averageRating: 4.7 // Esto vendría de las reseñas
      });

      setRecentAppointments(appointmentsData.data.slice(0, 5));
      setRecentPayments(paymentsData.data.slice(0, 5));

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  return (
    <div className="psychologist-dashboard p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Profesional</h1>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Pacientes Totales</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Próximas Citas</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.upcomingAppointments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Ingresos del Mes</h3>
              <p className="text-2xl font-bold text-gray-900">${stats.monthlyEarnings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Calificación Promedio</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.averageRating}/5</p>
            </div>
          </div>
        </div>
      </div>

      {/* Citas recientes y pagos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximas citas */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Próximas Citas</h2>
          </div>
          <div className="p-6">
            {recentAppointments.length === 0 ? (
              <p className="text-gray-500 text-center">No hay citas próximas</p>
            ) : (
              <div className="space-y-4">
                {recentAppointments.map((appointment: any) => (
                  <div key={appointment.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{appointment.patient.name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(appointment.date).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        appointment.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {appointment.status}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">{appointment.modality}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pagos recientes */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Pagos Recientes</h2>
          </div>
          <div className="p-6">
            {recentPayments.length === 0 ? (
              <p className="text-gray-500 text-center">No hay pagos recientes</p>
            ) : (
              <div className="space-y-4">
                {recentPayments.map((payment: any) => (
                  <div key={payment.payment_id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">${payment.net_amount.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">
                        {payment.appointment.patient_name}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        {payment.status}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(payment.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 🔒 Hook para Gestión de Psicólogos

```typescript
// hooks/usePsychologist.ts
import { useState, useEffect } from 'react';
import { psychologistApi } from '../lib/psychologist';
import { useAuth } from '../context/AuthContext';

export function usePsychologist() {
  const [profile, setProfile] = useState(null);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token || user?.role !== 'PSYCHOLOGIST') return;

      const data = await psychologistApi.getMyProfile(token);
      setProfile(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchPatients = async (page: number = 1) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const data = await psychologistApi.getPatients(page, token);
      setPatients(data.data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchAppointments = async (filters = {}) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const data = await psychologistApi.getAppointments(filters, token);
      setAppointments(data.data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchPayments = async (page: number = 1) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const data = await psychologistApi.getPayments(page, token);
      setPayments(data.data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const updateProfile = async (profileData: any) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('No authenticated');

      const updatedProfile = await psychologistApi.updateProfile(
        profileData,
        token,
      );
      setProfile(updatedProfile.psychologist);
      return updatedProfile;
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    if (user?.role === 'PSYCHOLOGIST') {
      Promise.all([
        fetchProfile(),
        fetchPatients(),
        fetchAppointments(),
        fetchPayments(),
      ]).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  return {
    profile,
    patients,
    appointments,
    payments,
    loading,
    error,
    refetchProfile: fetchProfile,
    refetchPatients: fetchPatients,
    refetchAppointments: fetchAppointments,
    refetchPayments: fetchPayments,
    updateProfile,
  };
}
```

## Panel de Administración para Verificación

### 🛡️ Componente de Verificación de Psicólogos

```typescript
// components/admin/PsychologistVerification.tsx
'use client';

import { useState, useEffect } from 'react';

export default function PsychologistVerification() {
  const [pendingPsychologists, setPendingPsychologists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPsychologist, setSelectedPsychologist] = useState(null);

  useEffect(() => {
    fetchPendingPsychologists();
  }, []);

  const fetchPendingPsychologists = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/psychologist/verification', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      setPendingPsychologists(data.data);
    } catch (error) {
      console.error('Error loading pending psychologists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async (psychologistId: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/psychologist/verification/${psychologistId}/validate`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Psicólogo validado exitosamente');
        fetchPendingPsychologists();
      }
    } catch (error) {
      alert('Error validando psicólogo');
    }
  };

  const handleReject = async (psychologistId: string) => {
    const reason = prompt('Motivo del rechazo:');
    if (!reason) return;

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/psychologist/verification/${psychologistId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason })
      });

      if (response.ok) {
        alert('Psicólogo rechazado');
        fetchPendingPsychologists();
      }
    } catch (error) {
      alert('Error rechazando psicólogo');
    }
  };

  if (loading) return <div>Cargando solicitudes de verificación...</div>;

  return (
    <div className="psychologist-verification p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Verificación de Psicólogos
      </h1>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Solicitudes Pendientes ({pendingPsychologists.length})
          </h2>
        </div>

        {pendingPsychologists.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No hay solicitudes pendientes de verificación
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {pendingPsychologists.map((psychologist: any) => (
              <div key={psychologist.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      {psychologist.name}
                    </h3>
                    <p className="text-gray-600">{psychologist.email}</p>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Título:</p>
                        <p className="text-sm text-gray-600">{psychologist.professional_title}</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700">Matrícula:</p>
                        <p className="text-sm text-gray-600">{psychologist.license_number}</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700">Experiencia:</p>
                        <p className="text-sm text-gray-600">{psychologist.professional_experience} años</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700">Consultorio:</p>
                        <p className="text-sm text-gray-600">{psychologist.office_address}</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700">Especialidades:</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {psychologist.specialities.map((specialty: string) => (
                          <span key={specialty} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {specialty.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    </div>

                    {psychologist.documents && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700">Documentos:</p>
                        <div className="mt-1 flex space-x-2">
                          {psychologist.documents.map((doc: any, index: number) => (
                            <a
                              key={index}
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm underline"
                            >
                              {doc.type}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="ml-6 flex flex-col space-y-2">
                    <button
                      onClick={() => handleValidate(psychologist.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm"
                    >
                      ✓ Validar
                    </button>

                    <button
                      onClick={() => handleReject(psychologist.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm"
                    >
                      ✗ Rechazar
                    </button>

                    <button
                      onClick={() => setSelectedPsychologist(psychologist)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                    >
                      Ver Detalles
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

## Validaciones y Reglas de Negocio

### 📋 Validaciones de DTO

```typescript
export class UpdatePsychologistDto {
  @IsOptional()
  @IsString()
  @Length(5, 50)
  license_number?: string;

  @IsOptional()
  @IsString()
  @Length(10, 200)
  office_address?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(50)
  professional_experience?: number;

  @IsOptional()
  @IsArray()
  @IsEnum(EPsychologistSpecialty, { each: true })
  specialities?: EPsychologistSpecialty[];

  @IsOptional()
  @IsArray()
  @IsEnum(ETherapyApproach, { each: true })
  therapy_approaches?: ETherapyApproach[];

  @IsOptional()
  @IsArray()
  @IsEnum(ESessionType, { each: true })
  session_types?: ESessionType[];

  @IsOptional()
  @IsEnum(EModality)
  modality?: EModality;

  @IsOptional()
  @IsArray()
  @IsEnum(EInsurance, { each: true })
  insurance_accepted?: EInsurance[];

  @IsOptional()
  @IsArray()
  @IsEnum(EAvailability, { each: true })
  availability?: EAvailability[];
}
```

### 🔒 Control de Acceso

- **Perfiles**: Solo el psicólogo propietario puede ver/editar su perfil
- **Verificación**: Solo administradores pueden validar/rechazar
- **Pacientes**: Solo el psicólogo puede ver sus pacientes
- **Citas/Pagos**: Acceso restringido al psicólogo propietario

## Consideraciones de Producción

### 🚀 Optimizaciones

```typescript
// Índices recomendados para performance
CREATE INDEX idx_psychologist_verified ON users(verified) WHERE role = 'PSYCHOLOGIST';
CREATE INDEX idx_psychologist_specialities ON users USING GIN(specialities) WHERE role = 'PSYCHOLOGIST';
CREATE INDEX idx_psychologist_availability ON users USING GIN(availability) WHERE role = 'PSYCHOLOGIST';
```

### 📈 Métricas y Monitoreo

```typescript
// Métricas importantes a trackear
const psychologistMetrics = {
  totalPsychologists: 'Total de psicólogos registrados',
  verifiedPsychologists: 'Psicólogos verificados',
  pendingVerifications: 'Verificaciones pendientes',
  averageRating: 'Calificación promedio',
  activeThisMonth: 'Psicólogos activos este mes',
};
```

## Próximas Mejoras

- [ ] Sistema de certificaciones adicionales
- [ ] Integración con colegios profesionales
- [ ] Dashboard de analytics avanzado
- [ ] Sistema de mentorías entre profesionales
- [ ] Marketplace de recursos terapéuticos
- [ ] Sistema de supervisión clínica
- [ ] Integración con seguros médicos
- [ ] Videoconferencias integradas
- [ ] Recordatorios automáticos
- [ ] Sistema de referencias entre profesionales
