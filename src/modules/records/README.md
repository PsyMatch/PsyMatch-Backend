# Módulo de Historiales Médicos (Records)

## Descripción General

El módulo de **Records** gestiona los historiales médicos y registros clínicos en PsyMatch. Proporciona un sistema seguro y confidencial para que los psicólogos documenten las sesiones, evolución del tratamiento y notas clínicas de sus pacientes. Este módulo es fundamental para mantener la continuidad del cuidado y cumplir con los estándares profesionales de documentación clínica.

## Funcionalidades Principales

### 📋 Gestión de Historiales Clínicos

- **Registro de sesiones**: Documentación detallada de cada consulta
- **Notas de evolución**: Seguimiento del progreso terapéutico
- **Historiales médicos**: Registros clínicos completos y seguros
- **Tipos de registro**: Notas personales y registros clínicos formales

### 🔒 Seguridad y Confidencialidad

- **Control de acceso**: Solo psicólogos pueden crear registros
- **Privacidad del paciente**: Acceso controlado a información sensible
- **Soft delete**: Eliminación lógica para preservar historial
- **Auditoría completa**: Timestamps de creación y modificación

### 📊 Organización y Búsqueda

- **Filtrado por paciente**: Historial completo por usuario
- **Filtrado por psicólogo**: Todos los registros de un profesional
- **Ordenamiento temporal**: Registros ordenados por fecha
- **Estados activos/inactivos**: Control de visibilidad de registros

## Estructura del Módulo

```
records/
├── records.controller.ts       # Controlador REST API
├── records.service.ts          # Lógica de negocio
├── records.module.ts           # Configuración del módulo
├── dto/
│   ├── create-record.dto.ts    # DTO para crear registros
│   ├── update-record.dto.ts    # DTO para actualizar registros
│   └── record-response.dto.ts  # DTO para respuestas
├── entities/
│   └── record.entity.ts        # Entidad de base de datos
└── enums/
    └── typeRecord.enum.ts      # Tipos de registro
```

## Entidad Record

### 🏛️ Esquema de Base de Datos

```sql
CREATE TABLE records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    psychologist_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    type record_type_enum NOT NULL DEFAULT 'Nota personal',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_records_psychologist FOREIGN KEY (psychologist_id) REFERENCES users(id),
    CONSTRAINT fk_records_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Índices para performance
CREATE INDEX idx_records_psychologist ON records(psychologist_id);
CREATE INDEX idx_records_user ON records(user_id);
CREATE INDEX idx_records_active ON records(is_active);
CREATE INDEX idx_records_created_at ON records(created_at DESC);
CREATE INDEX idx_records_type ON records(type);
```

### 📊 Enums del Sistema

#### Tipos de Registro

```typescript
export enum ETypeRecord {
  PERSONAL_NOTE = 'Nota personal', // Notas informales del psicólogo
  CLINICAL_RECORD = 'Historia clínica', // Registro clínico formal
}
```

### 🔗 Relaciones

- **Many-to-One con User**: Un registro pertenece a un paciente
- **Many-to-One con Psychologist**: Un registro es creado por un psicólogo
- **Soft Delete**: Campo `is_active` para eliminación lógica

## API Endpoints

### 🔹 POST `/records` - Crear Nuevo Registro

**Descripción**: Permite a un psicólogo crear un nuevo registro clínico para un paciente.

**Roles permitidos**: `PSYCHOLOGIST`

**Request Body**:

```json
{
  "psychologist_id": "psychologist-uuid",
  "user_id": "patient-uuid",
  "content": "El paciente mostró una mejora significativa en el manejo de la ansiedad. Durante la sesión se trabajaron técnicas de respiración y se asignaron ejercicios de mindfulness para practicar en casa. Se observa mayor conciencia sobre sus triggers emocionales.",
  "type": "CLINICAL_RECORD"
}
```

**Response** (201):

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Historial creado exitosamente",
  "data": {
    "id": "record-uuid",
    "psychologist_id": "psychologist-uuid",
    "user_id": "patient-uuid",
    "content": "El paciente mostró una mejora significativa...",
    "type": "CLINICAL_RECORD",
    "is_active": true,
    "created_at": "2024-03-15T10:30:00Z",
    "updated_at": "2024-03-15T10:30:00Z"
  }
}
```

### 🔹 GET `/records` - Obtener Todos los Registros

**Descripción**: Obtiene todos los registros del sistema (solo administradores).

**Roles permitidos**: `ADMIN`

**Query Parameters**:

- `includeInactive` (boolean): Incluir registros inactivos (default: false)

**Response** (200):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Historiales recuperados exitosamente",
  "data": [
    {
      "id": "record-uuid-1",
      "content": "Sesión inicial de evaluación. El paciente presenta síntomas de ansiedad generalizada...",
      "type": "CLINICAL_RECORD",
      "is_active": true,
      "created_at": "2024-03-15T10:30:00Z",
      "updated_at": "2024-03-15T10:30:00Z",
      "user": {
        "id": "patient-uuid",
        "name": "Juan Pérez",
        "email": "juan@email.com"
      },
      "psychologist": {
        "id": "psychologist-uuid",
        "name": "Dr. Ana García",
        "professional_title": "Psicóloga Clínica"
      }
    }
  ]
}
```

### 🔹 GET `/records/:id` - Obtener Registro por ID

**Descripción**: Obtiene un registro específico por su ID.

**Roles permitidos**: `ADMIN`, `PSYCHOLOGIST`, `PATIENT`

**Control de Acceso**:

- **Admin**: Acceso completo a todos los registros
- **Psychologist**: Solo registros que él creó
- **Patient**: Solo sus propios registros médicos

**Response** (200):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Historial recuperado exitosamente",
  "data": {
    "id": "record-uuid",
    "content": "Notas detalladas de la sesión de terapia cognitivo-conductual...",
    "type": "CLINICAL_RECORD",
    "is_active": true,
    "created_at": "2024-03-15T10:30:00Z",
    "updated_at": "2024-03-15T10:30:00Z",
    "user": {
      "id": "patient-uuid",
      "name": "Juan Pérez",
      "email": "juan@email.com"
    },
    "psychologist": {
      "id": "psychologist-uuid",
      "name": "Dr. Ana García",
      "professional_title": "Psicóloga Clínica",
      "specialities": ["ANXIETY_DISORDER", "COGNITIVE_BEHAVIORAL_THERAPY"]
    }
  }
}
```

### 🔹 GET `/records/user/:userId` - Obtener Registros por Paciente

**Descripción**: Obtiene todos los registros médicos de un paciente específico.

**Roles permitidos**: `ADMIN`, `PSYCHOLOGIST`, `PATIENT`

**Parámetros**:

- `userId` (string): UUID del paciente

**Response** (200):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Historiales del usuario recuperados exitosamente",
  "data": [
    {
      "id": "record-uuid-1",
      "content": "Sesión 1: Evaluación inicial. El paciente refiere ansiedad desde hace 3 meses...",
      "type": "CLINICAL_RECORD",
      "created_at": "2024-03-01T10:00:00Z",
      "psychologist": {
        "id": "psychologist-uuid",
        "name": "Dr. Ana García",
        "professional_title": "Psicóloga Clínica"
      }
    },
    {
      "id": "record-uuid-2",
      "content": "Sesión 2: Progreso notable en técnicas de relajación. El paciente reporta menos episodios de ansiedad...",
      "type": "CLINICAL_RECORD",
      "created_at": "2024-03-08T10:00:00Z",
      "psychologist": {
        "id": "psychologist-uuid",
        "name": "Dr. Ana García",
        "professional_title": "Psicóloga Clínica"
      }
    }
  ]
}
```

### 🔹 GET `/records/psychologist/:psychologistId` - Obtener Registros por Psicólogo

**Descripción**: Obtiene todos los registros creados por un psicólogo específico.

**Roles permitidos**: `PSYCHOLOGIST` (solo propios), `ADMIN`

**Response** (200):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Historiales del psicólogo recuperados exitosamente",
  "data": [
    {
      "id": "record-uuid-1",
      "content": "Paciente A: Sesión de terapia familiar exitosa...",
      "type": "CLINICAL_RECORD",
      "created_at": "2024-03-15T10:00:00Z",
      "user": {
        "id": "patient-uuid-1",
        "name": "Juan Pérez"
      }
    },
    {
      "id": "record-uuid-2",
      "content": "Paciente B: Avances significativos en el tratamiento de ansiedad...",
      "type": "PERSONAL_NOTE",
      "created_at": "2024-03-15T14:00:00Z",
      "user": {
        "id": "patient-uuid-2",
        "name": "María González"
      }
    }
  ]
}
```

### 🔹 PUT `/records/:id` - Actualizar Registro

**Descripción**: Actualiza un registro existente (solo el psicólogo que lo creó).

**Roles permitidos**: `PSYCHOLOGIST` (solo propios), `ADMIN`

**Request Body**:

```json
{
  "content": "Contenido actualizado del registro médico con nuevas observaciones y plan de tratamiento modificado.",
  "type": "CLINICAL_RECORD"
}
```

**Response** (200):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Historial actualizado exitosamente",
  "data": {
    "id": "record-uuid",
    "content": "Contenido actualizado del registro médico...",
    "type": "CLINICAL_RECORD",
    "updated_at": "2024-03-15T11:00:00Z"
  }
}
```

### 🔹 DELETE `/records/:id` - Eliminar Registro (Soft Delete)

**Descripción**: Elimina lógicamente un registro (lo marca como inactivo).

**Roles permitidos**: `PSYCHOLOGIST` (solo propios), `ADMIN`

**Response** (200):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Historial eliminado exitosamente",
  "data": {
    "id": "record-uuid",
    "is_active": false,
    "updated_at": "2024-03-15T11:30:00Z"
  }
}
```

## Integración con Frontend (Next.js)

### 🔧 Cliente de Registros Médicos

```typescript
// lib/records.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const recordsApi = {
  // Crear nuevo registro
  createRecord: async (recordData: CreateRecordData, token: string) => {
    const response = await fetch(`${API_BASE_URL}/records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(recordData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error creating record');
    }

    return response.json();
  },

  // Obtener registros de un paciente
  getPatientRecords: async (patientId: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/records/user/${patientId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error fetching patient records');
    }

    return response.json();
  },

  // Obtener registros del psicólogo
  getPsychologistRecords: async (psychologistId: string, token: string) => {
    const response = await fetch(
      `${API_BASE_URL}/records/psychologist/${psychologistId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error('Error fetching psychologist records');
    }

    return response.json();
  },

  // Obtener registro específico
  getRecordById: async (recordId: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/records/${recordId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error fetching record');
    }

    return response.json();
  },

  // Actualizar registro
  updateRecord: async (
    recordId: string,
    recordData: UpdateRecordData,
    token: string,
  ) => {
    const response = await fetch(`${API_BASE_URL}/records/${recordId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(recordData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error updating record');
    }

    return response.json();
  },

  // Eliminar registro (soft delete)
  deleteRecord: async (recordId: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/records/${recordId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error deleting record');
    }

    return response.json();
  },
};

// Tipos TypeScript
export interface CreateRecordData {
  psychologist_id: string;
  user_id: string;
  content: string;
  type: 'PERSONAL_NOTE' | 'CLINICAL_RECORD';
}

export interface UpdateRecordData {
  content?: string;
  type?: 'PERSONAL_NOTE' | 'CLINICAL_RECORD';
}

export interface MedicalRecord {
  id: string;
  psychologist_id: string;
  user_id: string;
  content: string;
  type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  psychologist?: {
    id: string;
    name: string;
    professional_title: string;
    specialities?: string[];
  };
}
```

### 📝 Componente de Creación de Registro

```typescript
// components/CreateRecordForm.tsx
'use client';

import { useState } from 'react';
import { recordsApi } from '../lib/records';
import { useAuth } from '../context/AuthContext';

interface CreateRecordFormProps {
  patientId: string;
  patientName: string;
  onRecordCreated?: (record: any) => void;
  onCancel?: () => void;
}

export default function CreateRecordForm({
  patientId,
  patientName,
  onRecordCreated,
  onCancel
}: CreateRecordFormProps) {
  const [content, setContent] = useState('');
  const [recordType, setRecordType] = useState<'PERSONAL_NOTE' | 'CLINICAL_RECORD'>('CLINICAL_RECORD');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    setSubmitting(true);

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authenticated');
      }

      const recordData = {
        psychologist_id: user.id,
        user_id: patientId,
        content: content.trim(),
        type: recordType
      };

      const response = await recordsApi.createRecord(recordData, token);

      onRecordCreated?.(response.data);
      alert('Registro creado exitosamente');

      // Reset form
      setContent('');
      setRecordType('CLINICAL_RECORD');

    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const getRecordTypeLabel = (type: string) => {
    return type === 'CLINICAL_RECORD' ? 'Historia Clínica' : 'Nota Personal';
  };

  const getContentPlaceholder = () => {
    if (recordType === 'CLINICAL_RECORD') {
      return `Registro clínico para ${patientName}:

• Motivo de consulta:
• Observaciones de la sesión:
• Plan de tratamiento:
• Próximos pasos:
• Notas adicionales:`;
    } else {
      return `Nota personal sobre ${patientName}:

• Impresiones generales:
• Aspectos a tener en cuenta:
• Recordatorios para próximas sesiones:`;
    }
  };

  return (
    <div className="create-record-form bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          Crear Registro Médico
        </h3>
        <p className="text-gray-600 mt-2">
          Paciente: <span className="font-medium">{patientName}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tipo de registro */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Registro *
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                value="CLINICAL_RECORD"
                checked={recordType === 'CLINICAL_RECORD'}
                onChange={(e) => setRecordType(e.target.value as any)}
                className="mr-3"
              />
              <div>
                <div className="font-medium">Historia Clínica</div>
                <div className="text-sm text-gray-500">Registro formal para expediente médico</div>
              </div>
            </label>

            <label className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                value="PERSONAL_NOTE"
                checked={recordType === 'PERSONAL_NOTE'}
                onChange={(e) => setRecordType(e.target.value as any)}
                className="mr-3"
              />
              <div>
                <div className="font-medium">Nota Personal</div>
                <div className="text-sm text-gray-500">Notas informales del psicólogo</div>
              </div>
            </label>
          </div>
        </div>

        {/* Contenido */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contenido del Registro *
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={getContentPlaceholder()}
            minLength={10}
            maxLength={5000}
            required
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">
              Mínimo 10 caracteres
            </span>
            <span className="text-xs text-gray-500">
              {content.length}/5000
            </span>
          </div>
        </div>

        {/* Información importante */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-yellow-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-yellow-800">Información Importante</h4>
              <div className="text-sm text-yellow-700 mt-1">
                <ul className="list-disc list-inside space-y-1">
                  <li>Los registros médicos son confidenciales y están protegidos por la privacidad del paciente</li>
                  <li>Solo usted y el paciente tendrán acceso a estos registros</li>
                  <li>Los registros clínicos forman parte del expediente médico oficial</li>
                  <li>Las notas personales son para su uso interno y seguimiento</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={submitting || content.length < 10}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creando...
              </div>
            ) : (
              `Crear ${getRecordTypeLabel(recordType)}`
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
```

### 📚 Componente de Historial Médico

```typescript
// components/MedicalRecordsList.tsx
'use client';

import { useState, useEffect } from 'react';
import { recordsApi } from '../lib/records';
import { useAuth } from '../context/AuthContext';

interface MedicalRecordsListProps {
  patientId?: string;
  psychologistId?: string;
  showPatientInfo?: boolean;
  showPsychologistInfo?: boolean;
}

export default function MedicalRecordsList({
  patientId,
  psychologistId,
  showPatientInfo = false,
  showPsychologistInfo = true
}: MedicalRecordsListProps) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [filter, setFilter] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    fetchRecords();
  }, [patientId, psychologistId]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      let data;
      if (patientId) {
        data = await recordsApi.getPatientRecords(patientId, token);
      } else if (psychologistId) {
        data = await recordsApi.getPsychologistRecords(psychologistId, token);
      } else {
        throw new Error('Either patientId or psychologistId must be provided');
      }

      setRecords(data.data || []);
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = records.filter(record => {
    if (filter === 'all') return true;
    return record.type === filter;
  });

  const getRecordTypeColor = (type: string) => {
    return type === 'CLINICAL_RECORD'
      ? 'bg-blue-100 text-blue-800'
      : 'bg-green-100 text-green-800';
  };

  const getRecordTypeLabel = (type: string) => {
    return type === 'CLINICAL_RECORD' ? 'Historia Clínica' : 'Nota Personal';
  };

  const formatContent = (content: string) => {
    // Truncar para vista de lista
    return content.length > 150 ? content.substring(0, 150) + '...' : content;
  };

  if (loading) return <div>Cargando registros médicos...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div className="medical-records-list">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Historial Médico
        </h2>

        {/* Filtros */}
        <div className="flex space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          >
            <option value="all">Todos los registros</option>
            <option value="CLINICAL_RECORD">Historia Clínica</option>
            <option value="PERSONAL_NOTE">Notas Personales</option>
          </select>
        </div>
      </div>

      {filteredRecords.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p>No hay registros médicos disponibles</p>
          <p className="text-sm text-gray-400">Los registros aparecerán aquí una vez que sean creados</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRecords.map((record: any) => (
            <div key={record.id} className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRecordTypeColor(record.type)}`}>
                    {getRecordTypeLabel(record.type)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(record.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedRecord(record)}
                  className="text-blue-600 hover:text-blue-800 text-sm underline"
                >
                  Ver completo
                </button>
              </div>

              {/* Información del paciente/psicólogo */}
              <div className="mb-3">
                {showPatientInfo && record.user && (
                  <p className="text-sm text-gray-600">
                    <strong>Paciente:</strong> {record.user.name}
                  </p>
                )}
                {showPsychologistInfo && record.psychologist && (
                  <p className="text-sm text-gray-600">
                    <strong>Psicólogo:</strong> {record.psychologist.name} - {record.psychologist.professional_title}
                  </p>
                )}
              </div>

              {/* Contenido */}
              <div className="text-gray-700">
                <p className="whitespace-pre-line">{formatContent(record.content)}</p>
              </div>

              {/* Metadatos */}
              <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
                <span>ID: {record.id.substring(0, 8)}...</span>
                {record.updated_at !== record.created_at && (
                  <span>Actualizado: {new Date(record.updated_at).toLocaleDateString('es-ES')}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para ver registro completo */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {getRecordTypeLabel(selectedRecord.type)}
                  </h3>
                  <p className="text-gray-600">
                    {new Date(selectedRecord.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Información completa */}
              <div className="space-y-4">
                {showPatientInfo && selectedRecord.user && (
                  <div>
                    <h4 className="font-medium text-gray-700">Paciente</h4>
                    <p className="text-gray-600">{selectedRecord.user.name} ({selectedRecord.user.email})</p>
                  </div>
                )}

                {showPsychologistInfo && selectedRecord.psychologist && (
                  <div>
                    <h4 className="font-medium text-gray-700">Psicólogo</h4>
                    <p className="text-gray-600">
                      {selectedRecord.psychologist.name} - {selectedRecord.psychologist.professional_title}
                    </p>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-gray-700">Contenido</h4>
                  <div className="mt-2 p-4 bg-gray-50 rounded-md">
                    <p className="text-gray-700 whitespace-pre-line">{selectedRecord.content}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

### 🔒 Hook para Gestión de Registros

```typescript
// hooks/useRecords.ts
import { useState, useEffect } from 'react';
import { recordsApi } from '../lib/records';
import { useAuth } from '../context/AuthContext';

export function useRecords(patientId?: string, psychologistId?: string) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      let data;
      if (patientId) {
        data = await recordsApi.getPatientRecords(patientId, token);
      } else if (psychologistId) {
        data = await recordsApi.getPsychologistRecords(psychologistId, token);
      } else {
        return;
      }

      setRecords(data.data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createRecord = async (recordData: any) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('No authenticated');

      const newRecord = await recordsApi.createRecord(recordData, token);

      // Actualizar la lista local
      setRecords((prev) => [newRecord.data, ...prev]);

      return newRecord;
    } catch (err) {
      throw err;
    }
  };

  const updateRecord = async (recordId: string, recordData: any) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('No authenticated');

      const updatedRecord = await recordsApi.updateRecord(
        recordId,
        recordData,
        token,
      );

      // Actualizar la lista local
      setRecords((prev) =>
        prev.map((record) =>
          record.id === recordId
            ? { ...record, ...updatedRecord.data }
            : record,
        ),
      );

      return updatedRecord;
    } catch (err) {
      throw err;
    }
  };

  const deleteRecord = async (recordId: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('No authenticated');

      await recordsApi.deleteRecord(recordId, token);

      // Remover de la lista local
      setRecords((prev) => prev.filter((record) => record.id !== recordId));
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    if (patientId || psychologistId) {
      fetchRecords();
    }
  }, [patientId, psychologistId]);

  return {
    records,
    loading,
    error,
    refetch: fetchRecords,
    createRecord,
    updateRecord,
    deleteRecord,
  };
}
```

## Validaciones y Reglas de Negocio

### 📋 Validaciones de DTO

```typescript
export class CreateRecordDto {
  @IsNotEmpty({ message: 'El ID del psicólogo es obligatorio' })
  @IsUUID('4', { message: 'El ID del psicólogo debe ser un UUID válido' })
  psychologist_id: string;

  @IsNotEmpty({ message: 'El ID del usuario es obligatorio' })
  @IsUUID('4', { message: 'El ID del usuario debe ser un UUID válido' })
  user_id: string;

  @IsNotEmpty({ message: 'El contenido del historial es obligatorio' })
  @IsString({ message: 'El contenido debe ser un string' })
  @Length(10, 5000, {
    message: 'El contenido debe tener entre 10 y 5000 caracteres',
  })
  content: string;

  @IsNotEmpty({ message: 'El tipo de historial es obligatorio' })
  @IsEnum(ETypeRecord, {
    message: `El tipo debe ser uno de: ${Object.values(ETypeRecord).join(', ')}`,
  })
  type: ETypeRecord;
}
```

### 🔒 Control de Acceso

- **CREATE**: Solo `PSYCHOLOGIST` pueden crear registros
- **READ ALL**: Solo `ADMIN` puede ver todos los registros
- **READ ONE**: `PATIENT` (solo sus registros), `PSYCHOLOGIST` (solo los que creó), `ADMIN`
- **UPDATE**: Solo el `PSYCHOLOGIST` que creó el registro o `ADMIN`
- **DELETE**: Solo el `PSYCHOLOGIST` que creó el registro o `ADMIN`

## Consideraciones de Seguridad

### 🛡️ Medidas de Protección

1. **Confidencialidad médica**: Solo acceso autorizado a registros
2. **Soft delete**: Los registros nunca se eliminan físicamente
3. **Auditoría completa**: Timestamps de todas las operaciones
4. **Encriptación**: Datos sensibles protegidos en tránsito y reposo
5. **Control de acceso granular**: Permisos específicos por rol

### 🔐 Privacidad del Paciente

```typescript
// Middleware de verificación de acceso
const verifyRecordAccess = async (
  userId: string,
  recordId: string,
  userRole: string,
) => {
  const record = await recordRepository.findOne({
    where: { id: recordId },
    relations: ['user', 'psychologist'],
  });

  if (!record) {
    throw new NotFoundException('Record not found');
  }

  // Admin tiene acceso completo
  if (userRole === 'ADMIN') {
    return true;
  }

  // Paciente solo puede ver sus registros
  if (userRole === 'PATIENT' && record.user.id !== userId) {
    throw new ForbiddenException('Access denied');
  }

  // Psicólogo solo puede ver registros que creó
  if (userRole === 'PSYCHOLOGIST' && record.psychologist.id !== userId) {
    throw new ForbiddenException('Access denied');
  }

  return true;
};
```

## Consideraciones de Producción

### 🚀 Optimizaciones

```sql
-- Índices para performance
CREATE INDEX idx_records_patient_date ON records(user_id, created_at DESC);
CREATE INDEX idx_records_psychologist_date ON records(psychologist_id, created_at DESC);
CREATE INDEX idx_records_type_active ON records(type, is_active);

-- Particionamiento por fecha para grandes volúmenes
CREATE TABLE records_2024 PARTITION OF records
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
```

### 📈 Métricas de Monitoreo

```typescript
const recordMetrics = {
  totalRecords: 'Total de registros creados',
  recordsPerPsychologist: 'Promedio de registros por psicólogo',
  recordsPerPatient: 'Promedio de registros por paciente',
  clinicalVsPersonalRatio: 'Ratio de registros clínicos vs notas personales',
  averageRecordLength: 'Longitud promedio de registros',
};
```

## Próximas Mejoras

- [ ] Sistema de plantillas para registros
- [ ] Búsqueda de texto completo en contenido
- [ ] Exportación de historiales en PDF
- [ ] Versionado de registros con historial de cambios
- [ ] Integración con sistemas de salud externos
- [ ] Recordatorios automáticos para actualizar registros
- [ ] Dashboard de analytics para psicólogos
- [ ] Validación de contenido con IA
- [ ] Sistema de backup automático
- [ ] Compliance con estándares médicos (HL7, FHIR)
