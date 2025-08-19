# Módulo de Reseñas (Reviews)

## Descripción General

El módulo de **Reviews** gestiona el sistema completo de reseñas y calificaciones de PsyMatch. Permite a los pacientes evaluar y comentar sobre la calidad del servicio recibido de los psicólogos, contribuyendo a la transparencia y mejora continua de la plataforma. Proporciona un sistema robusto de feedback que ayuda tanto a futuros pacientes como a los profesionales.

## Funcionalidades Principales

### ⭐ Sistema de Calificaciones

- **Calificación numérica**: Escala de 1 a 5 estrellas
- **Comentarios detallados**: Feedback específico sobre la experiencia
- **Validación de autenticidad**: Solo pacientes con citas completadas pueden reseñar
- **Prevención de duplicados**: Un paciente puede reseñar una vez por sesión

### 📊 Analytics y Estadísticas

- **Calificación promedio**: Cálculo automático por psicólogo
- **Número total de reseñas**: Contador de feedback recibido
- **Historial completo**: Seguimiento temporal de las evaluaciones
- **Filtros y búsquedas**: Organización por fecha, calificación y keywords

### 🔒 Moderación y Control

- **Validación de contenido**: Filtros para comentarios inapropiados
- **Gestión administrativa**: Herramientas para moderadores
- **Reportes de abuso**: Sistema de denuncias por contenido inadecuado
- **Anonimización opcional**: Protección de la privacidad del paciente

## Estructura del Módulo

```
reviews/
├── reviews.controller.ts       # Controlador REST API
├── reviews.service.ts          # Lógica de negocio
├── reviews.module.ts           # Configuración del módulo
├── dto/
│   ├── create-review.dto.ts    # DTO para crear reseñas
│   └── review-response.dto.ts  # DTO para respuestas
└── entities/
    └── reviews.entity.ts       # Entidad de base de datos
```

## Entidad Reviews

### 🏛️ Esquema de Base de Datos

```sql
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rating DECIMAL(10,2) NOT NULL,
    comment TEXT NOT NULL,
    review_date DATE NOT NULL,
    psychologist_id UUID REFERENCES users(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
    is_anonymous BOOLEAN DEFAULT FALSE,
    is_flagged BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT rating_range CHECK (rating >= 1 AND rating <= 5),
    CONSTRAINT unique_review_per_appointment UNIQUE(patient_id, appointment_id)
);

-- Índices para performance
CREATE INDEX idx_reviews_psychologist ON reviews(psychologist_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_date ON reviews(review_date);
```

### 🔗 Relaciones

- **Many-to-One con Psychologist**: Una reseña pertenece a un psicólogo
- **Many-to-One con Patient**: Una reseña pertenece a un paciente
- **One-to-One con Appointment**: Una reseña está vinculada a una cita específica

## API Endpoints

### 🔹 POST `/reviews` - Crear Nueva Reseña

**Descripción**: Permite a un paciente crear una reseña después de completar una sesión.

**Roles permitidos**: `PATIENT`, `ADMIN`

**Request Body**:

```json
{
  "psychologistId": "psychologist-uuid",
  "rating": 5,
  "comment": "Excelente profesional, muy empático y efectivo en su enfoque terapéutico.",
  "appointmentId": "appointment-uuid",
  "isAnonymous": false
}
```

**Response** (201):

```json
{
  "message": "Reseña creada exitosamente",
  "review": {
    "id": "review-uuid",
    "rating": 5,
    "comment": "Excelente profesional, muy empático y efectivo en su enfoque terapéutico.",
    "review_date": "2024-03-15",
    "psychologist": {
      "id": "psychologist-uuid",
      "name": "Dr. Ana García",
      "professional_title": "Psicóloga Clínica"
    },
    "patient": {
      "id": "patient-uuid",
      "name": "Juan Pérez"
    },
    "appointment": {
      "id": "appointment-uuid",
      "date": "2024-03-10T15:00:00Z"
    },
    "is_anonymous": false,
    "created_at": "2024-03-15T10:00:00Z"
  }
}
```

**Validaciones**:

- Rating debe estar entre 1 y 5
- Comentario mínimo 10 caracteres, máximo 500
- Solo se puede reseñar citas completadas
- Un paciente solo puede hacer una reseña por cita

### 🔹 GET `/reviews/:psychologistId` - Obtener Reseñas de un Psicólogo

**Descripción**: Recupera todas las reseñas de un psicólogo específico con estadísticas.

**Roles permitidos**: `PATIENT`, `PSYCHOLOGIST`, `ADMIN`

**Parámetros**:

- `psychologistId` (string): UUID del psicólogo

**Query Parameters**:

- `page` (number): Número de página (default: 1)
- `limit` (number): Elementos por página (default: 10)
- `rating` (number): Filtrar por calificación específica
- `sortBy` (string): Ordenar por 'date' o 'rating' (default: 'date')
- `order` (string): 'ASC' o 'DESC' (default: 'DESC')

**Response** (200):

```json
{
  "psychologist_id": "psychologist-uuid",
  "psychologist_name": "Dr. Ana García",
  "psychologist_title": "Psicóloga Clínica",
  "statistics": {
    "average_rating": 4.7,
    "total_reviews": 28,
    "rating_distribution": {
      "5": 18,
      "4": 7,
      "3": 2,
      "2": 1,
      "1": 0
    }
  },
  "reviews": [
    {
      "id": "review-uuid-1",
      "rating": 5,
      "comment": "Excelente profesional, muy recomendable.",
      "review_date": "2024-03-15",
      "patient_name": "Juan P.", // Anonimizado si es necesario
      "appointment_date": "2024-03-10T15:00:00Z",
      "is_anonymous": false,
      "is_verified": true // Solo reseñas de citas reales
    },
    {
      "id": "review-uuid-2",
      "rating": 4,
      "comment": "Muy buena atención, me ayudó mucho con mis problemas de ansiedad.",
      "review_date": "2024-03-12",
      "patient_name": "Usuario Anónimo",
      "appointment_date": "2024-03-08T14:00:00Z",
      "is_anonymous": true,
      "is_verified": true
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 28,
    "itemsPerPage": 10
  }
}
```

### 🔹 GET `/reviews/stats/:psychologistId` - Estadísticas de Reseñas

**Descripción**: Obtiene estadísticas detalladas de las reseñas de un psicólogo.

**Roles permitidos**: `PSYCHOLOGIST` (solo su perfil), `ADMIN`

**Response** (200):

```json
{
  "psychologist_id": "psychologist-uuid",
  "overall_stats": {
    "average_rating": 4.7,
    "total_reviews": 28,
    "total_patients_reviewed": 25,
    "review_percentage": 89.3 // % de pacientes que dejaron reseña
  },
  "rating_breakdown": {
    "5_stars": { "count": 18, "percentage": 64.3 },
    "4_stars": { "count": 7, "percentage": 25.0 },
    "3_stars": { "count": 2, "percentage": 7.1 },
    "2_stars": { "count": 1, "percentage": 3.6 },
    "1_star": { "count": 0, "percentage": 0.0 }
  },
  "trends": {
    "last_30_days": {
      "new_reviews": 5,
      "average_rating": 4.8
    },
    "last_90_days": {
      "new_reviews": 12,
      "average_rating": 4.6
    }
  },
  "common_keywords": [
    { "word": "profesional", "frequency": 15 },
    { "word": "empático", "frequency": 12 },
    { "word": "efectivo", "frequency": 10 },
    { "word": "recomendable", "frequency": 9 }
  ]
}
```

### 🔹 PUT `/reviews/:id` - Actualizar Reseña

**Descripción**: Permite al autor de la reseña editarla dentro de un período limitado.

**Roles permitidos**: `PATIENT` (solo su reseña), `ADMIN`

**Request Body**:

```json
{
  "rating": 4,
  "comment": "Comentario actualizado después de más sesiones.",
  "isAnonymous": true
}
```

**Response** (200):

```json
{
  "message": "Reseña actualizada exitosamente",
  "review": {
    "id": "review-uuid",
    "rating": 4,
    "comment": "Comentario actualizado después de más sesiones.",
    "updated_at": "2024-03-16T10:00:00Z"
  }
}
```

### 🔹 DELETE `/reviews/:id` - Eliminar Reseña

**Descripción**: Elimina una reseña (solo administradores o en casos especiales).

**Roles permitidos**: `ADMIN`

**Response** (200):

```json
{
  "message": "Reseña eliminada exitosamente",
  "review_id": "review-uuid"
}
```

### 🔹 POST `/reviews/:id/flag` - Reportar Reseña Inapropiada

**Descripción**: Permite reportar una reseña por contenido inapropiado.

**Roles permitidos**: `PATIENT`, `PSYCHOLOGIST`, `ADMIN`

**Request Body**:

```json
{
  "reason": "INAPPROPRIATE_LANGUAGE",
  "description": "La reseña contiene lenguaje ofensivo"
}
```

**Response** (200):

```json
{
  "message": "Reseña reportada exitosamente",
  "report_id": "report-uuid",
  "status": "PENDING_REVIEW"
}
```

## Integración con Frontend (Next.js)

### 🔧 Cliente de Reseñas

```typescript
// lib/reviews.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const reviewsApi = {
  // Crear nueva reseña
  createReview: async (reviewData: CreateReviewData, token: string) => {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error creating review');
    }

    return response.json();
  },

  // Obtener reseñas de un psicólogo
  getPsychologistReviews: async (
    psychologistId: string,
    filters: ReviewFilters = {},
    token?: string,
  ) => {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) queryParams.append(key, value.toString());
    });

    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(
      `${API_BASE_URL}/reviews/${psychologistId}?${queryParams}`,
      { headers },
    );

    if (!response.ok) {
      throw new Error('Error fetching reviews');
    }

    return response.json();
  },

  // Obtener estadísticas de reseñas
  getReviewStats: async (psychologistId: string, token: string) => {
    const response = await fetch(
      `${API_BASE_URL}/reviews/stats/${psychologistId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error('Error fetching review stats');
    }

    return response.json();
  },

  // Actualizar reseña
  updateReview: async (
    reviewId: string,
    reviewData: UpdateReviewData,
    token: string,
  ) => {
    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error updating review');
    }

    return response.json();
  },

  // Reportar reseña
  flagReview: async (
    reviewId: string,
    flagData: FlagReviewData,
    token: string,
  ) => {
    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}/flag`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(flagData),
    });

    if (!response.ok) {
      throw new Error('Error flagging review');
    }

    return response.json();
  },
};

// Tipos TypeScript
export interface CreateReviewData {
  psychologistId: string;
  rating: number;
  comment: string;
  appointmentId: string;
  isAnonymous?: boolean;
}

export interface UpdateReviewData {
  rating?: number;
  comment?: string;
  isAnonymous?: boolean;
}

export interface ReviewFilters {
  page?: number;
  limit?: number;
  rating?: number;
  sortBy?: 'date' | 'rating';
  order?: 'ASC' | 'DESC';
}

export interface FlagReviewData {
  reason: 'INAPPROPRIATE_LANGUAGE' | 'SPAM' | 'FALSE_INFORMATION' | 'OTHER';
  description: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  review_date: string;
  patient_name: string;
  appointment_date: string;
  is_anonymous: boolean;
  is_verified: boolean;
}
```

### ⭐ Componente de Formulario de Reseña

```typescript
// components/ReviewForm.tsx
'use client';

import { useState } from 'react';
import { reviewsApi } from '../lib/reviews';
import { useAuth } from '../context/AuthContext';

interface ReviewFormProps {
  psychologistId: string;
  psychologistName: string;
  appointmentId: string;
  onReviewCreated?: (review: any) => void;
  onCancel?: () => void;
}

export default function ReviewForm({
  psychologistId,
  psychologistName,
  appointmentId,
  onReviewCreated,
  onCancel
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Por favor selecciona una calificación');
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authenticated');
      }

      const reviewData = {
        psychologistId,
        rating,
        comment,
        appointmentId,
        isAnonymous
      };

      const response = await reviewsApi.createReview(reviewData, token);

      onReviewCreated?.(response.review);
      alert('Reseña creada exitosamente');

      // Reset form
      setRating(0);
      setComment('');
      setIsAnonymous(false);

    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = () => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            onClick={() => setRating(star)}
            className={`text-3xl transition-colors ${
              star <= (hoveredRating || rating)
                ? 'text-yellow-400'
                : 'text-gray-300'
            } hover:text-yellow-400`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  const getRatingText = (rating: number) => {
    const texts = {
      1: 'Muy insatisfecho',
      2: 'Insatisfecho',
      3: 'Neutral',
      4: 'Satisfecho',
      5: 'Muy satisfecho'
    };
    return texts[rating] || '';
  };

  return (
    <div className="review-form bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          Evaluar sesión con {psychologistName}
        </h3>
        <p className="text-gray-600 mt-2">
          Comparte tu experiencia para ayudar a otros pacientes
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Calificación *
          </label>
          <div className="flex items-center space-x-4">
            {renderStars()}
            <span className="text-sm text-gray-600">
              {rating > 0 && getRatingText(rating)}
            </span>
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comentario *
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe tu experiencia con este psicólogo. ¿Qué te gustó? ¿Qué podrían mejorar?"
            minLength={10}
            maxLength={500}
            required
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">
              Mínimo 10 caracteres
            </span>
            <span className="text-xs text-gray-500">
              {comment.length}/500
            </span>
          </div>
        </div>

        {/* Anonymous option */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="anonymous"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="anonymous" className="ml-2 text-sm text-gray-700">
            Publicar como anónimo
          </label>
        </div>

        {/* Guidelines */}
        <div className="bg-blue-50 p-4 rounded-md">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            Pautas para reseñas
          </h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Sé honesto y constructivo en tu evaluación</li>
            <li>• Evita información personal sensible</li>
            <li>• Enfócate en aspectos profesionales del servicio</li>
            <li>• Respeta la privacidad y confidencialidad</li>
          </ul>
        </div>

        {/* Buttons */}
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
            disabled={submitting || rating === 0 || comment.length < 10}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enviando...
              </div>
            ) : (
              'Enviar Reseña'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
```

### 📊 Componente de Mostrar Reseñas

```typescript
// components/ReviewsList.tsx
'use client';

import { useState, useEffect } from 'react';
import { reviewsApi } from '../lib/reviews';

interface ReviewsListProps {
  psychologistId: string;
  showStats?: boolean;
  maxReviews?: number;
}

export default function ReviewsList({
  psychologistId,
  showStats = true,
  maxReviews
}: ReviewsListProps) {
  const [reviewsData, setReviewsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    rating: '',
    sortBy: 'date',
    order: 'DESC'
  });

  useEffect(() => {
    fetchReviews();
  }, [psychologistId, currentPage, filters]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewsApi.getPsychologistReviews(
        psychologistId,
        {
          page: currentPage,
          limit: maxReviews || 10,
          rating: filters.rating ? parseInt(filters.rating) : undefined,
          sortBy: filters.sortBy as any,
          order: filters.order as any
        }
      );
      setReviewsData(data);
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-xl'
    };

    return (
      <div className={`flex ${sizeClasses[size]}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const getRatingDistributionWidth = (count: number, total: number) => {
    return total > 0 ? (count / total) * 100 : 0;
  };

  if (loading) return <div>Cargando reseñas...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!reviewsData) return <div>No se pudieron cargar las reseñas</div>;

  return (
    <div className="reviews-list">
      {/* Estadísticas */}
      {showStats && reviewsData.statistics && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Reseñas y Calificaciones
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Resumen */}
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900">
                {reviewsData.statistics.average_rating.toFixed(1)}
              </div>
              <div className="flex justify-center mt-2 mb-2">
                {renderStars(Math.round(reviewsData.statistics.average_rating), 'lg')}
              </div>
              <div className="text-gray-600">
                Basado en {reviewsData.statistics.total_reviews} reseñas
              </div>
            </div>

            {/* Distribución */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = reviewsData.statistics.rating_distribution[rating] || 0;
                const width = getRatingDistributionWidth(count, reviewsData.statistics.total_reviews);

                return (
                  <div key={rating} className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 w-8">{rating}★</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${width}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filtrar por calificación
            </label>
            <select
              value={filters.rating}
              onChange={(e) => setFilters({...filters, rating: e.target.value})}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="">Todas las calificaciones</option>
              <option value="5">5 estrellas</option>
              <option value="4">4 estrellas</option>
              <option value="3">3 estrellas</option>
              <option value="2">2 estrellas</option>
              <option value="1">1 estrella</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ordenar por
            </label>
            <select
              value={`${filters.sortBy}-${filters.order}`}
              onChange={(e) => {
                const [sortBy, order] = e.target.value.split('-');
                setFilters({...filters, sortBy, order});
              }}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="date-DESC">Más recientes</option>
              <option value="date-ASC">Más antiguos</option>
              <option value="rating-DESC">Mejor calificados</option>
              <option value="rating-ASC">Menor calificados</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de reseñas */}
      <div className="space-y-4">
        {reviewsData.reviews.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No hay reseñas que coincidan con los filtros seleccionados.
          </div>
        ) : (
          reviewsData.reviews.map((review: any) => (
            <div key={review.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {renderStars(review.rating)}
                    <span className="text-sm text-gray-500">
                      por {review.patient_name}
                    </span>
                    {review.is_verified && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Verificado
                      </span>
                    )}
                  </div>

                  <p className="text-gray-700 mb-3">{review.comment}</p>

                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <span>
                      Sesión: {new Date(review.appointment_date).toLocaleDateString('es-ES')}
                    </span>
                    <span>
                      Reseña: {new Date(review.review_date).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                </div>

                <div className="ml-4">
                  <button
                    onClick={() => {
                      // Implementar reporte de reseña
                      const reason = prompt('Motivo del reporte:');
                      if (reason) {
                        console.log('Reportar reseña:', review.id, reason);
                      }
                    }}
                    className="text-gray-400 hover:text-gray-600 text-sm"
                    title="Reportar reseña"
                  >
                    ⚠️
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Paginación */}
      {reviewsData.pagination && reviewsData.pagination.totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50"
            >
              Anterior
            </button>

            <span className="px-3 py-2 bg-blue-600 text-white rounded-md">
              {currentPage} de {reviewsData.pagination.totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(Math.min(reviewsData.pagination.totalPages, currentPage + 1))}
              disabled={currentPage === reviewsData.pagination.totalPages}
              className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

### 📈 Dashboard de Reseñas para Psicólogos

```typescript
// components/PsychologistReviewsDashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import { reviewsApi } from '../lib/reviews';
import { useAuth } from '../context/AuthContext';

export default function PsychologistReviewsDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recentReviews, setRecentReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === 'PSYCHOLOGIST') {
      fetchReviewData();
    }
  }, [user]);

  const fetchReviewData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token || !user) return;

      const [statsData, reviewsData] = await Promise.all([
        reviewsApi.getReviewStats(user.id, token),
        reviewsApi.getPsychologistReviews(user.id, { limit: 5 }, token)
      ]);

      setStats(statsData);
      setRecentReviews(reviewsData.reviews);
    } catch (error) {
      console.error('Error loading review data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando estadísticas de reseñas...</div>;
  if (!stats) return <div>Error cargando datos</div>;

  return (
    <div className="psychologist-reviews-dashboard">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Mis Reseñas y Calificaciones
      </h2>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-2xl">⭐</span>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Calificación Promedio</h3>
              <p className="text-2xl font-bold text-gray-900">
                {stats.overall_stats.average_rating.toFixed(1)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">📝</span>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Reseñas</h3>
              <p className="text-2xl font-bold text-gray-900">
                {stats.overall_stats.total_reviews}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">% de Pacientes que Reseñan</h3>
              <p className="text-2xl font-bold text-gray-900">
                {stats.overall_stats.review_percentage.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">📈</span>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Últimos 30 días</h3>
              <p className="text-2xl font-bold text-gray-900">
                {stats.trends.last_30_days.new_reviews}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Distribución de calificaciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Distribución de Calificaciones
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.rating_breakdown).map(([key, data]: [string, any]) => {
              const rating = key.replace('_stars', '').replace('_star', '');
              return (
                <div key={key} className="flex items-center">
                  <span className="text-sm text-gray-600 w-12">{rating}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-3 mx-3">
                    <div
                      className="bg-yellow-400 h-3 rounded-full"
                      style={{ width: `${data.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-16">
                    {data.count} ({data.percentage.toFixed(1)}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Palabras Clave Frecuentes
          </h3>
          <div className="flex flex-wrap gap-2">
            {stats.common_keywords.map((keyword: any) => (
              <span
                key={keyword.word}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                title={`Mencionado ${keyword.frequency} veces`}
              >
                {keyword.word} ({keyword.frequency})
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Reseñas recientes */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Reseñas Recientes</h3>
        </div>
        <div className="p-6">
          {recentReviews.length === 0 ? (
            <p className="text-gray-500 text-center">No hay reseñas recientes</p>
          ) : (
            <div className="space-y-4">
              {recentReviews.map((review: any) => (
                <div key={review.id} className="border-l-4 border-yellow-400 pl-4">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star}>
                          {star <= review.rating ? '★' : '☆'}
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      por {review.patient_name}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2">{review.comment}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(review.review_date).toLocaleDateString('es-ES')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

### 🔒 Hook para Gestión de Reseñas

```typescript
// hooks/useReviews.ts
import { useState, useEffect } from 'react';
import { reviewsApi } from '../lib/reviews';
import { useAuth } from '../context/AuthContext';

export function useReviews(psychologistId?: string) {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchReviews = async (targetId?: string, filters = {}) => {
    try {
      setLoading(true);
      const id = targetId || psychologistId;
      if (!id) return;

      const token = localStorage.getItem('auth_token');
      const data = await reviewsApi.getPsychologistReviews(id, filters, token);
      setReviews(data.reviews);
      setStats(data.statistics);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createReview = async (reviewData: any) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('No authenticated');

      const newReview = await reviewsApi.createReview(reviewData, token);

      // Actualizar la lista local
      setReviews((prev) => [newReview.review, ...prev]);

      return newReview;
    } catch (err) {
      throw err;
    }
  };

  const updateReview = async (reviewId: string, reviewData: any) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('No authenticated');

      const updatedReview = await reviewsApi.updateReview(
        reviewId,
        reviewData,
        token,
      );

      // Actualizar la lista local
      setReviews((prev) =>
        prev.map((review) =>
          review.id === reviewId
            ? { ...review, ...updatedReview.review }
            : review,
        ),
      );

      return updatedReview;
    } catch (err) {
      throw err;
    }
  };

  const flagReview = async (reviewId: string, flagData: any) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('No authenticated');

      await reviewsApi.flagReview(reviewId, flagData, token);

      // Marcar como reportada localmente
      setReviews((prev) =>
        prev.map((review) =>
          review.id === reviewId ? { ...review, is_flagged: true } : review,
        ),
      );
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    if (psychologistId) {
      fetchReviews();
    }
  }, [psychologistId]);

  return {
    reviews,
    stats,
    loading,
    error,
    refetch: fetchReviews,
    createReview,
    updateReview,
    flagReview,
  };
}
```

## Validaciones y Reglas de Negocio

### 📋 Validaciones de DTO

```typescript
export class CreateReviewDto {
  @IsInt({ message: 'La calificación debe ser un número entero.' })
  @Min(1, { message: 'La calificación debe ser al menos 1.' })
  @Max(5, { message: 'La calificación debe ser como máximo 5.' })
  rating: number;

  @IsString({ message: 'El comentario debe ser un string.' })
  @IsNotEmpty({ message: 'El comentario no puede estar vacío.' })
  @MinLength(10, {
    message: 'El comentario debe tener al menos 10 caracteres.',
  })
  @MaxLength(500, { message: 'El comentario no puede exceder 500 caracteres.' })
  comment: string;

  @IsUUID('4', { message: 'El ID del psicólogo debe ser un UUID válido.' })
  psychologistId: string;

  @IsUUID('4', { message: 'El ID de la cita debe ser un UUID válido.' })
  appointmentId: string;

  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean = false;
}
```

### 🔒 Reglas de Negocio

1. **Autenticidad**: Solo pacientes con citas completadas pueden reseñar
2. **Unicidad**: Una reseña por paciente por cita
3. **Tiempo límite**: Las reseñas pueden editarse solo dentro de 7 días
4. **Moderación**: Sistema automático de detección de contenido inapropiado
5. **Privacidad**: Opción de reseñas anónimas disponible

## Consideraciones de Seguridad

### 🛡️ Medidas Implementadas

- **Validación de ownership**: Solo el autor puede editar su reseña
- **Rate limiting**: Prevención de spam de reseñas
- **Filtrado de contenido**: Detección automática de lenguaje inapropiado
- **Reportes de abuso**: Sistema de moderación por la comunidad
- **Anonimización**: Protección de identidad cuando se solicita

## Consideraciones de Producción

### 🚀 Optimizaciones

```sql
-- Índices para performance
CREATE INDEX idx_reviews_psychologist_rating ON reviews(psychologist_id, rating);
CREATE INDEX idx_reviews_date_desc ON reviews(review_date DESC);
CREATE INDEX idx_reviews_flagged ON reviews(is_flagged) WHERE is_flagged = true;

-- Vista materializada para estadísticas
CREATE MATERIALIZED VIEW psychologist_review_stats AS
SELECT
    psychologist_id,
    COUNT(*) as total_reviews,
    AVG(rating) as average_rating,
    COUNT(*) FILTER (WHERE rating = 5) as five_star_count,
    COUNT(*) FILTER (WHERE rating = 4) as four_star_count,
    COUNT(*) FILTER (WHERE rating = 3) as three_star_count,
    COUNT(*) FILTER (WHERE rating = 2) as two_star_count,
    COUNT(*) FILTER (WHERE rating = 1) as one_star_count
FROM reviews
GROUP BY psychologist_id;
```

### 📈 Métricas de Monitoreo

```typescript
const reviewMetrics = {
  averageRatingPlatform: 'Calificación promedio de la plataforma',
  reviewsPerDay: 'Reseñas creadas por día',
  flaggedReviewsRate: 'Tasa de reseñas reportadas',
  reviewResponseTime: 'Tiempo promedio para dejar reseña',
  editedReviewsRate: 'Porcentaje de reseñas editadas',
};
```

## Próximas Mejoras

- [ ] Sistema de respuestas de psicólogos a reseñas
- [ ] Análisis de sentimientos con IA
- [ ] Recomendaciones basadas en reseñas similares
- [ ] Sistema de badges por buenas reseñas
- [ ] Integración con sistemas de verificación externos
- [ ] Dashboard de analytics avanzado para reseñas
- [ ] Notificaciones push para nuevas reseñas
- [ ] Sistema de recompensas por reseñas constructivas
- [ ] Herramientas de moderación con IA
- [ ] Exportación de reportes de reseñas
