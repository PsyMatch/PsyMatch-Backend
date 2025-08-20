# Módulo de Citas (Appointments)

## Descripción General

El módulo de **Appointments** es el núcleo del sistema de gestión de citas de PsyMatch. Este módulo maneja todas las operaciones relacionadas con la programación, modificación y seguimiento de citas entre pacientes y psicólogos, con horarios específicos y validaciones estrictas.

## Funcionalidades Principales

### 📅 Gestión de Citas

- **Crear citas**: Programación de nuevas sesiones con horarios específicos
- **Consultar citas**: Obtener listado filtrado según el rol del usuario
- **Actualizar citas**: Modificar detalles como fecha, duración o estado
- **Eliminar citas**: Cancelación y eliminación de citas

### 📊 Estados de Citas

- `PENDING`: Cita programada pero no confirmada
- `CONFIRMED`: Cita confirmada por ambas partes
- `COMPLETED`: Sesión finalizada
- `CANCELLED`: Cita cancelada

### 🏥 Modalidades de Atención

- `IN_PERSON`: Presencial
- `ONLINE`: En línea (videoconferencia)
- `PHONE`: Telefónica

### ⏰ Horarios Disponibles

- **Horarios fijos**: 09:00, 10:00, 11:00, 14:00, 15:00, 16:00
- **Duración estándar**: 45 minutos por sesión
- **Validación estricta**: Solo horarios específicos permitidos

## Estructura del Módulo

```
appointments/
├── appointments.controller.ts    # Controlador REST API
├── appointments.service.ts       # Lógica de negocio
├── appointments.module.ts        # Configuración del módulo
├── documentation/
│   └── createApppointment.documentation.ts # Documentación Swagger
├── dto/
│   ├── create-appointment.dto.ts # DTO para crear citas
│   └── update-appointment.dto.ts # DTO para actualizar citas
├── entities/
│   └── appointment.entity.ts     # Entidad de base de datos
└── enums/
    └── appointment-status.enum.ts # Estados de las citas
```

## API Endpoints

### 🔹 POST `/appointments` - Crear Cita

**Descripción**: Crea una nueva cita entre un paciente y un psicólogo.

**Request Body**:

```json
{
  "date": "2025-08-15",
  "hour": "14:00",
  "notes": "Primera consulta - ansiedad generalizada",
  "psychologist_id": "uuid-del-psicologo",
  "modality": "ONLINE",
  "session_type": "INDIVIDUAL",
  "therapy_approach": "COGNITIVE_BEHAVIORAL",
  "specialty": "ANXIETY_DISORDERS",
  "amount": 5000
}
```

**Response**:

```json
{
  "id": "appointment-uuid",
  "date": "2025-08-15T14:00:00Z",
  "hour": "14:00",
  "duration": 45,
  "notes": "Primera consulta - ansiedad generalizada",
  "status": "PENDING",
  "modality": "ONLINE",
  "session_type": "INDIVIDUAL",
  "therapy_approach": "COGNITIVE_BEHAVIORAL",
  "specialty": "ANXIETY_DISORDERS",
  "amount": 5000,
  "patient": {
    "id": "patient-uuid",
    "name": "Juan",
    "last_name": "Pérez",
    "email": "juan@email.com"
  },
  "psychologist": {
    "id": "psychologist-uuid",
    "name": "Ana",
    "last_name": "García",
    "email": "ana@psicologo.com"
  }
}
```

### 🔹 GET `/appointments` - Obtener Citas

**Descripción**: Recupera las citas según el rol del usuario:

- **Administradores**: Ven todas las citas del sistema
- **Psicólogos**: Solo sus propias citas
- **Pacientes**: Solo sus propias citas

**Response**:

```json
[
  {
    "id": "appointment-uuid",
    "date": "2025-08-15T14:00:00Z",
    "hour": "14:00",
    "duration": 45,
    "status": "CONFIRMED",
    "modality": "En línea",
    "patient": {
      "id": "patient-uuid",
      "name": "Juan Pérez",
      "email": "juan@email.com"
    },
    "psychologist": {
      "id": "psychologist-uuid",
      "name": "Dr. Ana García",
      "email": "ana@psycologo.com"
    }
  }
]
```

### 🔹 GET `/appointments/:id` - Obtener Cita por ID

**Descripción**: Recupera una cita específica por su ID.

**Parámetros**:

- `id` (string): UUID de la cita

**Response**:

```json
{
  "id": "appointment-uuid",
  "date": "2024-03-15T10:00:00Z",
  "duration": 60,
  "notes": "Primera consulta",
  "status": "confirmed",
  "modality": "En línea",
  "patient": {
    "id": "patient-uuid",
    "name": "Juan Pérez",
    "email": "juan@email.com"
  },
  "psychologist": {
    "id": "psychologist-uuid",
    "name": "Dr. Ana García",
    "email": "ana@psycologo.com"
  }
}
```

### 🔹 PUT `/appointments/:id` - Actualizar Cita

**Descripción**: Actualiza los detalles de una cita existente.

**Request Body** (todos los campos son opcionales):

```json
{
  "date": "2024-03-15T14:00:00Z",
  "duration": 90,
  "status": "confirmed",
  "modality": "Presencial",
  "notes": "Sesión de seguimiento"
}
```

**Response**:

```json
{
  "id": "appointment-uuid",
  "date": "2024-03-15T14:00:00Z",
  "duration": 90,
  "status": "confirmed",
  "modality": "Presencial",
  "notes": "Sesión de seguimiento"
}
```

### 🔹 DELETE `/appointments/:id` - Eliminar Cita

**Descripción**: Elimina una cita del sistema.

**Response**:

```json
{
  "message": "Appointment with ID appointment-uuid deleted successfully",
  "appointment_id": "appointment-uuid"
}
```

## Integración con Frontend (Next.js)

### 🔧 Configuración del Cliente HTTP

```typescript
// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const appointmentsApi = {
  // Crear cita
  create: async (appointmentData: CreateAppointmentData) => {
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(appointmentData),
    });
    return response.json();
  },

  // Obtener todas las citas
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.json();
  },

  // Obtener cita por ID
  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.json();
  },

  // Actualizar cita
  update: async (id: string, updateData: UpdateAppointmentData) => {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(updateData),
    });
    return response.json();
  },

  // Eliminar cita
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.json();
  },
};
```

### 📱 Componentes de React

#### Componente de Lista de Citas

```typescript
// components/AppointmentsList.tsx
'use client';

import { useEffect, useState } from 'react';
import { appointmentsApi } from '../lib/api';

interface Appointment {
  id: string;
  date: string;
  duration: number;
  status: string;
  modality: string;
  patient: {
    id: string;
    name: string;
    email: string;
  };
  psychologist: {
    id: string;
    name: string;
    email: string;
  };
}

export default function AppointmentsList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await appointmentsApi.getAll();
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <div>Cargando citas...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Mis Citas</h2>
      {appointments.map((appointment) => (
        <div key={appointment.id} className="border rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">
                Dr. {appointment.psychologist.name}
              </h3>
              <p className="text-gray-600">
                📅 {formatDate(appointment.date)}
              </p>
              <p className="text-gray-600">
                ⏱️ {appointment.duration} minutos
              </p>
              <p className="text-gray-600">
                📍 {appointment.modality}
              </p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
              {appointment.status.toUpperCase()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
```

#### Componente de Formulario de Cita

```typescript
// components/AppointmentForm.tsx
'use client';

import { useState } from 'react';
import { appointmentsApi } from '../lib/api';

interface AppointmentFormProps {
  psychologistId: string;
  onSuccess?: () => void;
}

export default function AppointmentForm({ psychologistId, onSuccess }: AppointmentFormProps) {
  const [formData, setFormData] = useState({
    date: '',
    duration: 60,
    notes: '',
    modality: 'En línea'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const appointmentData = {
        ...formData,
        user_id: 'current-user-id', // Obtener del contexto de autenticación
        psychologist_id: psychologistId,
        status: 'pending'
      };

      await appointmentsApi.create(appointmentData);
      alert('Cita creada exitosamente');
      onSuccess?.();
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('Error al crear la cita');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Fecha y Hora
        </label>
        <input
          type="datetime-local"
          value={formData.date}
          onChange={(e) => setFormData({...formData, date: e.target.value})}
          className="w-full border rounded-md px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Duración (minutos)
        </label>
        <select
          value={formData.duration}
          onChange={(e) => setFormData({...formData, duration: Number(e.target.value)})}
          className="w-full border rounded-md px-3 py-2"
        >
          <option value={30}>30 minutos</option>
          <option value={45}>45 minutos</option>
          <option value={60}>60 minutos</option>
          <option value={90}>90 minutos</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Modalidad
        </label>
        <select
          value={formData.modality}
          onChange={(e) => setFormData({...formData, modality: e.target.value})}
          className="w-full border rounded-md px-3 py-2"
        >
          <option value="En línea">En línea</option>
          <option value="Presencial">Presencial</option>
          <option value="Híbrido">Híbrido</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Notas (opcional)
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
          className="w-full border rounded-md px-3 py-2"
          rows={3}
          placeholder="Motivo de la consulta o notas adicionales..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Creando cita...' : 'Agendar Cita'}
      </button>
    </form>
  );
}
```

### 🔄 Hooks Personalizados

```typescript
// hooks/useAppointments.ts
import { useState, useEffect } from 'react';
import { appointmentsApi } from '../lib/api';

export function useAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentsApi.getAll();
      setAppointments(data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const createAppointment = async (appointmentData: any) => {
    try {
      const newAppointment = await appointmentsApi.create(appointmentData);
      setAppointments((prev) => [...prev, newAppointment]);
      return newAppointment;
    } catch (err) {
      throw err;
    }
  };

  const updateAppointment = async (id: string, updateData: any) => {
    try {
      const updatedAppointment = await appointmentsApi.update(id, updateData);
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === id ? updatedAppointment : apt)),
      );
      return updatedAppointment;
    } catch (err) {
      throw err;
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      await appointmentsApi.delete(id);
      setAppointments((prev) => prev.filter((apt) => apt.id !== id));
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return {
    appointments,
    loading,
    error,
    refetch: fetchAppointments,
    create: createAppointment,
    update: updateAppointment,
    delete: deleteAppointment,
  };
}
```

## Relaciones de Base de Datos

### 🔗 Entidad Appointment

La entidad `Appointment` se relaciona con:

- **Patient** (many-to-one): Cada cita pertenece a un paciente
- **Psychologist** (many-to-one): Cada cita está asignada a un psicólogo

### 📋 Esquema de la Tabla

```sql
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER,
  notes TEXT,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  psychologist_id UUID REFERENCES psychologists(id) ON DELETE CASCADE,
  status appointment_status DEFAULT 'pending',
  modality modality_enum NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Validaciones

### 📝 CreateAppointmentDto

- `date`: Fecha obligatoria en formato ISO 8601
- `duration`: Entero mínimo 15 minutos (opcional)
- `notes`: Máximo 500 caracteres (opcional)
- `user_id`: UUID válido obligatorio
- `psychologist_id`: UUID válido obligatorio
- `status`: Enum de estado válido (opcional)
- `modality`: Enum de modalidad obligatorio

### 🔄 UpdateAppointmentDto

- Todos los campos son opcionales
- Mismas validaciones que CreateAppointmentDto

## Manejo de Errores

### ❌ Errores Comunes

- **404 Not Found**: Cita, paciente o psicólogo no encontrado
- **400 Bad Request**: Datos de validación incorrectos
- **401 Unauthorized**: Token de autenticación inválido o expirado

### 🛠️ Manejo en Frontend

```typescript
// utils/errorHandler.ts
export const handleAppointmentError = (error: any) => {
  if (error.status === 404) {
    return 'Cita no encontrada';
  } else if (error.status === 400) {
    return 'Datos inválidos. Verifique la información ingresada';
  } else if (error.status === 401) {
    return 'Sesión expirada. Por favor, inicie sesión nuevamente';
  } else {
    return 'Error interno del servidor. Intente nuevamente';
  }
};
```

## Casos de Uso Principales

### 🎯 Flujo de Creación de Cita

1. **Usuario selecciona psicólogo** en el frontend
2. **Frontend muestra formulario** de agendamiento
3. **Usuario completa datos** (fecha, modalidad, etc.)
4. **Frontend valida datos** localmente
5. **Envío de datos** al endpoint POST `/appointments`
6. **Backend valida** existencia de usuario y psicólogo
7. **Creación de cita** en base de datos
8. **Respuesta exitosa** con datos de la cita creada

### 📅 Flujo de Visualización de Citas

1. **Frontend solicita citas** al endpoint GET `/appointments`
2. **Backend recupera citas** con información de relaciones
3. **Frontend muestra lista** con formato amigable
4. **Opción de filtros** por estado, fecha, etc.

## Consideraciones de Seguridad

- **Autenticación obligatoria** para todos los endpoints
- **Validación de pertenencia** de citas al usuario autenticado
- **Sanitización de inputs** para prevenir inyección SQL
- **Límites de rate limiting** para prevenir abuso

## Próximas Mejoras

- [ ] Filtrado avanzado de citas (por fecha, estado, modalidad)
- [ ] Notificaciones automáticas de recordatorio
- [ ] Integración con calendario externo (Google Calendar)
- [ ] Sistema de confirmación por email/SMS
- [ ] Historial de cambios en las citas
- [ ] Disponibilidad automática de psicólogos
