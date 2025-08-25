# Módulo de Autenticación (Auth)

## Descripción General

El módulo de **Auth** es el sistema de autenticación y autorización de PsyMatch. Maneja el registro de usuarios y psicólogos, inicio de sesión, autenticación con Google OAuth2, y la generación de tokens JWT para proteger rutas de la aplicación.

## Funcionalidades Principales

### 🔐 Autenticación

- **Registro de pacientes**: Registro completo con validaciones y subida de fotos
- **Registro de psicólogos**: Registro profesional con credenciales y especialidades
- **Inicio de sesión**: Autenticación con email y contraseña
- **Google OAuth2**: Login social con Google
- **JWT Tokens**: Generación y validación de tokens seguros

### 👥 Gestión de Roles

- `PATIENT`: Paciente del sistema
- `PSYCHOLOGIST`: Psicólogo profesional
- `ADMIN`: Administrador del sistema

### 🛡️ Seguridad

- Encriptación de contraseñas con bcrypt
- Rate limiting para prevenir ataques de fuerza bruta
- Validación robusta de datos de entrada
- Tokens JWT con expiración configurable

## Estructura del Módulo

```
auth/
├── auth.controller.ts           # Controlador REST API
├── auth.service.ts             # Lógica de negocio y autenticación
├── auth.module.ts              # Configuración del módulo
├── documentation/
│   ├── signin.doc.ts           # Documentación Swagger signin
│   ├── signup.doc.ts           # Documentación Swagger signup pacientes
│   └── signup-psychologist.doc.ts # Documentación Swagger signup psicólogos
├── dto/
│   ├── signin.dto.ts           # DTO para inicio de sesión
│   ├── signup.dto.ts           # DTO para registro de pacientes
│   └── signup-psychologist.dto.ts # DTO para registro de psicólogos
├── decorators/
│   └── role.decorator.ts       # Decorador para control de roles
├── guards/
│   ├── combined-auth.guard.ts  # Guard combinado JWT/Google
│   └── roles.guard.ts          # Guard de autorización por roles
├── interfaces/
│   ├── auth-request.interface.ts    # Interface para request autenticado
│   ├── google-required-data.interface.ts # Interface para Google OAuth
│   └── jwt-payload.interface.ts     # Interface para payload JWT
└── strategies/
    ├── google.strategy.ts      # Estrategia Google OAuth2
    └── jwt.strategy.ts         # Estrategia JWT
```

│ └── jwt-payload.interface.ts # Interface para payload JWT
└── strategies/
└── google.strategy.ts # Estrategia de autenticación Google

````

## API Endpoints

### 🔹 POST `/auth/signup` - Registro de Paciente

**Descripción**: Registra un nuevo paciente en el sistema con validaciones completas.

**Content-Type**: `multipart/form-data`

**Request Body**:

```json
{
  "name": "María González",
  "birthdate": "1995-03-15",
  "phone": "+5491155443322",
  "dni": "98765432",
  "address": "Av. Santa Fe 1234, CABA, Argentina",
  "latitude": "-34.5998",
  "longitude": "-58.3837",
  "email": "maria.gonzalez@gmail.com",
  "password": "MiContraseña123!",
  "confirmPassword": "MiContraseña123!",
  "health_insurance": "OSDE",
  "emergency_contact": "María Pérez - +5411987654321 - Madre",
  "profile_picture": "(archivo JPG/PNG/WEBP - máx 2MB)"
}
````

**Response** (201):

```json
{
  "message": "Usuario registrado exitosamente",
  "data": {
    "id": "user-uuid",
    "name": "María González",
    "birthdate": "1995-03-15",
    "phone": "+5491155443322",
    "dni": 98765432,
    "address": "Av. Santa Fe 1234, CABA, Argentina",
    "email": "maria.gonzalez@gmail.com",
    "health_insurance": "OSDE",
    "emergency_contact": "María Pérez - +5411987654321 - Madre",
    "role": "Paciente",
    "profile_picture": "https://cloudinary.com/optimized-url"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 🔹 POST `/auth/signup/psychologist` - Registro de Psicólogo

**Descripción**: Registra un nuevo psicólogo con credenciales profesionales completas.

**Content-Type**: `multipart/form-data`

**Request Body**:

```json
{
  "name": "Dr. Carlos Mendoza",
  "birthdate": "1985-03-15",
  "phone": "+5411555123456",
  "dni": 20123456,
  "office_address": "Consultorio en Av. Rivadavia 5000, 2do Piso",
  "latitude": "-34.6118",
  "longitude": "-58.4173",
  "email": "carlos.mendoza@psychologist.com",
  "password": "MiContraseñaSegura123!",
  "confirmPassword": "MiContraseñaSegura123!",
  "professional_title": "Psicólogo Clínico",
  "license_number": 123451,
  "personal_biography": "Psicólogo especializado en terapia cognitivo conductual con 10 años de experiencia.",
  "professional_experience": 5,
  "languages": ["Español", "Inglés"],
  "therapy_approaches": [
    "Terapia cognitivo-conductual",
    "Terapia psicodinámica"
  ],
  "session_types": ["Individual", "Pareja"],
  "modality": "Presencial",
  "specialities": ["Trastorno de ansiedad", "Depresión", "Trauma y TEPT"],
  "insurance_accepted": ["OSDE", "Swiss Medical", "IOMA"],
  "availability": ["Lunes", "Miércoles", "Viernes"],
  "profile_picture": "(archivo JPG/PNG/WEBP - máx 2MB)"
}
```

**Response** (201):

```json
{
  "message": "Psicólogo registrado exitosamente",
  "data": {
    "id": "psychologist-uuid",
    "name": "Dr. Carlos Mendoza",
    "email": "carlos.mendoza@psychologist.com",
    "professional_title": "Psicólogo Clínico",
    "license_number": 123451,
    "verified": "Pendiente",
    "role": "Psicólogo",
    "specialities": ["Trastorno de ansiedad", "Depresión"],
    "modality": "Presencial",
    "profile_picture": "https://cloudinary.com/optimized-url"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 🔹 POST `/auth/signin` - Inicio de Sesión

**Descripción**: Autentica un usuario con email y contraseña.

**Rate Limit**: 5 intentos por minuto por IP

**Content-Type**: `multipart/form-data`

**Request Body**:

```json
{
  "email": "tu@email.com",
  "password": "Contraseña123!"
}
```

**Response** (200):

```json
{
  "message": "Usuario autenticado exitosamente",
  "data": {
    "id": "user-uuid",
    "name": "María González",
    "email": "maria.gonzalez@gmail.com",
    "role": "Paciente",
    "profile_picture": "https://cloudinary.com/optimized-url",
    "last_login": "2024-03-15T10:30:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 🔹 GET `/auth/google` - Iniciar Autenticación Google

**Descripción**: Redirige al usuario a la página de autenticación de Google.

**Uso**: Redirección automática a Google OAuth2

### 🔹 GET `/auth/google/callback` - Callback de Google

**Descripción**: Maneja la respuesta de Google OAuth2 y crea/autentica usuario.

**Response**: Redirección a `/dashboard/user` con cookie de autenticación

## Integración con Frontend (Next.js)

### 🔧 Configuración del Cliente de Autenticación

```typescript
// lib/auth.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const authApi = {
  // Registro de paciente
  signupPatient: async (formData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      body: formData, // FormData para archivos
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error en el registro');
    }

    return response.json();
  },

  // Registro de psicólogo
  signupPsychologist: async (formData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup/psychologist`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error en el registro de psicólogo');
    }

    return response.json();
  },

  // Inicio de sesión
  signin: async (credentials: { email: string; password: string }) => {
    const formData = new FormData();
    formData.append('email', credentials.email);
    formData.append('password', credentials.password);

    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Credenciales inválidas');
    }

    return response.json();
  },

  // Logout
  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  },

  // Obtener token almacenado
  getToken: () => {
    return localStorage.getItem('auth_token');
  },

  // Almacenar datos de autenticación
  storeAuth: (token: string, userData: any) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_data', JSON.stringify(userData));
  },

  // Obtener datos del usuario
  getUserData: () => {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  },
};
```

### 🔒 Context de Autenticación

```typescript
// context/AuthContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../lib/auth';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  profile_picture?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un usuario autenticado al cargar
    const token = authApi.getToken();
    const userData = authApi.getUserData();

    if (token && userData) {
      setUser(userData);
    }

    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.signin({ email, password });
      const { token, data: userData } = response;

      authApi.storeAuth(token, userData);
      setUser(userData);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

### 📝 Componente de Login

```typescript
// components/LoginForm.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <div>
        <label className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="w-full border rounded-md px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Contraseña
        </label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          className="w-full border rounded-md px-3 py-2"
          required
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>

      <div className="text-center">
        <button
          type="button"
          onClick={() => window.location.href = '/auth/google'}
          className="text-blue-600 hover:underline"
        >
          Iniciar sesión con Google
        </button>
      </div>
    </form>
  );
}
```

### 📝 Componente de Registro de Paciente

```typescript
// components/PatientSignupForm.tsx
'use client';

import { useState } from 'react';
import { authApi } from '../lib/auth';
import { useRouter } from 'next/navigation';

export default function PatientSignupForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dni: '',
    birthdate: '',
    address: '',
    health_insurance: ''
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const submitFormData = new FormData();

    // Agregar todos los campos del formulario
    Object.entries(formData).forEach(([key, value]) => {
      if (value) submitFormData.append(key, value);
    });

    // Agregar imagen si existe
    if (profilePicture) {
      submitFormData.append('profile_picture', profilePicture);
    }

    try {
      const response = await authApi.signupPatient(submitFormData);

      // Almacenar token y datos de usuario
      authApi.storeAuth(response.token, response.data);

      alert('Registro exitoso');
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <div>
        <label className="block text-sm font-medium mb-1">
          Nombre Completo *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full border rounded-md px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Email *
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="w-full border rounded-md px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Contraseña *
        </label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          className="w-full border rounded-md px-3 py-2"
          required
        />
        <small className="text-gray-500">
          Debe contener mayúscula, minúscula y número
        </small>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Confirmar Contraseña *
        </label>
        <input
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
          className="w-full border rounded-md px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Teléfono *
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          className="w-full border rounded-md px-3 py-2"
          placeholder="+5411123456789"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          DNI *
        </label>
        <input
          type="number"
          value={formData.dni}
          onChange={(e) => setFormData({...formData, dni: e.target.value})}
          className="w-full border rounded-md px-3 py-2"
          placeholder="12345678"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Fecha de Nacimiento *
        </label>
        <input
          type="date"
          value={formData.birthdate}
          onChange={(e) => setFormData({...formData, birthdate: e.target.value})}
          className="w-full border rounded-md px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Obra Social
        </label>
        <select
          value={formData.health_insurance}
          onChange={(e) => setFormData({...formData, health_insurance: e.target.value})}
          className="w-full border rounded-md px-3 py-2"
        >
          <option value="">Seleccionar obra social</option>
          <option value="OSDE">OSDE</option>
          <option value="Swiss Medical">Swiss Medical</option>
          <option value="IOMA">IOMA</option>
          <option value="PAMI">PAMI</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Foto de Perfil
        </label>
        <input
          type="file"
          onChange={(e) => setProfilePicture(e.target.files?.[0] || null)}
          className="w-full border rounded-md px-3 py-2"
          accept="image/*"
        />
        <small className="text-gray-500">
          JPG, PNG, WEBP (máx. 2MB)
        </small>
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Registrando...' : 'Crear Cuenta'}
      </button>
    </form>
  );
}
```

### 🛡️ Middleware de Autenticación

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token =
    request.cookies.get('auth_token')?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '');

  // Rutas protegidas
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Rutas solo para invitados
  if (
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/register')
  ) {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
```

### 🔒 Hook para Peticiones Autenticadas

```typescript
// hooks/useAuthenticatedFetch.ts
import { useAuth } from '../context/AuthContext';

export function useAuthenticatedFetch() {
  const { logout } = useAuth();

  const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      logout();
      throw new Error('No authenticated');
    }

    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      logout();
      throw new Error('Session expired');
    }

    return response;
  };

  return authenticatedFetch;
}
```

## Sistema de Guards y Protección

### 🔐 AuthGuard

- **Propósito**: Verificar que el usuario esté autenticado
- **Validación**: Token JWT válido en header Authorization
- **Respuesta**: Decodifica payload y adjunta usuario al request

### 👥 RolesGuard

- **Propósito**: Verificar permisos por rol
- **Uso**: Combinado con decorador `@Roles()`
- **Control**: Acceso basado en `PATIENT`, `PSYCHOLOGIST`, `ADMIN`

### 👤 SameUserGuard

- **Propósito**: Verificar que el usuario solo acceda a sus propios datos
- **Validación**: ID del token coincide con ID del recurso

## Validaciones de Datos

### 📝 Registro de Paciente

- **Email**: Formato válido y único
- **Contraseña**: Mínimo 6 caracteres, mayúscula, minúscula, número
- **DNI**: Entre 7-8 dígitos, único
- **Teléfono**: Formato internacional válido
- **Fecha nacimiento**: Formato ISO válido

### 👨‍⚕️ Registro de Psicólogo

- **Matrícula**: 6 dígitos, única
- **Título profesional**: Requerido
- **Especialidades**: Al menos una especialidad
- **Experiencia**: Años de experiencia
- **Idiomas**: Lista de idiomas disponibles

## Manejo de Errores

### ❌ Errores de Autenticación

- **400 Bad Request**: Datos inválidos o faltantes
- **401 Unauthorized**: Credenciales incorrectas o token expirado
- **409 Conflict**: Email, DNI o matrícula ya existe
- **429 Too Many Requests**: Rate limit excedido

### 🛠️ Manejo en Frontend

```typescript
// utils/authErrorHandler.ts
export const handleAuthError = (error: any) => {
  if (error.status === 400) {
    return 'Datos inválidos. Verifique la información ingresada';
  } else if (error.status === 401) {
    return 'Credenciales incorrectas';
  } else if (error.status === 409) {
    return 'El email o DNI ya está registrado';
  } else if (error.status === 429) {
    return 'Demasiados intentos. Espere un momento';
  } else {
    return 'Error interno del servidor';
  }
};
```

## Rate Limiting

### ⚡ Configuración de Límites

- **Short**: 3 requests por segundo
- **Medium**: 20 requests por 10 segundos
- **Long**: 100 requests por minuto
- **Login específico**: 5 intentos por minuto

## OAuth2 con Google

### 🔧 Configuración

```bash
# Variables de entorno requeridas
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
```

### 🌐 Flujo de Google Login

1. **Frontend redirecciona** a `/auth/google`
2. **Usuario autentica** en Google
3. **Google redirecciona** a `/auth/google/callback`
4. **Backend procesa** información de Google
5. **Crea/actualiza usuario** automáticamente
6. **Establece cookie** de autenticación
7. **Redirecciona** a dashboard

## Seguridad Avanzada

### 🔐 Encriptación

- **bcrypt**: Hash de contraseñas con salt
- **JWT**: Tokens firmados con secret configurable
- **HTTPS**: Cookies seguras en producción

### 🛡️ Protecciones

- **SQL Injection**: Uso de TypeORM con parámetros
- **XSS**: Validación y sanitización de inputs
- **CSRF**: SameSite cookies y verificación de origen

## Consideraciones de Producción

### 📈 Escalabilidad

- **Stateless**: Tokens JWT sin sesiones en servidor
- **Cache**: Posible cache de validaciones JWT
- **Load Balancing**: Compatible con múltiples instancias

### 📊 Monitoreo

- **Logs de autenticación**: Registro de intentos exitosos/fallidos
- **Métricas de rate limiting**: Monitoreo de ataques
- **Alertas de seguridad**: Notificación de actividad sospechosa

## Próximas Mejoras

- [ ] Autenticación de dos factores (2FA)
- [ ] Recuperación de contraseña por email
- [ ] Refresh tokens para mayor seguridad
- [ ] Single Sign-On (SSO) empresarial
- [ ] Verificación de email obligatoria
- [ ] Bloqueo temporal por intentos fallidos
- [ ] Integración con más proveedores OAuth (Facebook, Apple)
- [ ] Logs de auditoría de accesos
