# Maps Module - Backend API

## Descripción
El módulo Maps proporciona funcionalidades de geolocalización y mapas para conectar pacientes con psicólogos. Permite obtener direcciones entre ubicaciones y buscar psicólogos cercanos en un radio específico.

## Endpoints Disponibles

### 1. Obtener Direcciones - `POST /maps/directions/:id`

Genera un enlace de Google Maps con direcciones desde la ubicación del paciente hasta la oficina del psicólogo especificado.

#### Parámetros
- **id** (path parameter): ID del psicólogo de destino

#### Headers Requeridos
```javascript
{
  "Authorization": "Bearer <JWT_TOKEN>",
  "Content-Type": "application/x-www-form-urlencoded"
}
```

#### Ejemplo de uso desde Next.js
```javascript
const getDirections = async (psychologistId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/maps/directions/${psychologistId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error obteniendo direcciones:', error);
    throw error;
  }
};
```

#### Respuesta Exitosa (200)
```json
{
  "message": "Direcciones obtenidas con éxito",
  "directions": {
    "from": "Dirección del paciente",
    "to": "Dirección de la oficina del psicólogo",
    "link": "https://www.google.com/maps/dir/?api=1&origin=...&destination=..."
  }
}
```

#### Posibles Errores
- **401**: Token inválido o expirado
- **404**: No se encontró el usuario con ese ID
- **500**: Error interno del servidor

---

### 2. Buscar Psicólogos Cercanos - `POST /maps/nearby`

Busca psicólogos dentro de un radio específico desde la ubicación del paciente autenticado.

#### Query Parameters
- **distance** (opcional): Distancia máxima en kilómetros (por defecto: 5 km)

#### Headers Requeridos
```javascript
{
  "Authorization": "Bearer <JWT_TOKEN>"
}
```

#### Ejemplo de uso desde Next.js
```javascript
const getNearbyPsychologists = async (maxDistance = 5) => {
  try {
    const response = await fetch(`${API_BASE_URL}/maps/nearby?distance=${maxDistance}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error obteniendo psicólogos cercanos:', error);
    throw error;
  }
};
```

#### Respuesta Exitosa (200)
```json
{
  "message": "Se encontraron 3 psicólogos en un radio de 5 km",
  "psychologists": [
    {
      "name": "Dr. Juan Pérez",
      "email": "juan.perez@email.com",
      "address": "Calle Ejemplo 123, Buenos Aires",
      "distance": 1200,
      "link": "https://www.google.com/maps/dir/?api=1&origin=...&destination=..."
    },
    {
      "name": "Dra. María González",
      "email": "maria.gonzalez@email.com",
      "address": "Av. Corrientes 456, Buenos Aires",
      "distance": 2300,
      "link": "https://www.google.com/maps/dir/?api=1&origin=...&destination=..."
    }
  ]
}
```

#### Posibles Errores
- **401**: Token inválido o expirado
- **404**: No se encontró el usuario con ese ID o no hay psicólogos en el rango especificado
- **500**: Error interno del servidor

---

## Implementación en React/Next.js

### Hook personalizado para Maps
```javascript
// hooks/useMaps.js
import { useState } from 'react';
import { useAuth } from './useAuth'; // Asume que tienes un hook de auth

export const useMaps = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const getDirections = async (psychologistId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/maps/directions/${psychologistId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error obteniendo direcciones');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getNearbyPsychologists = async (distance = 5) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/maps/nearby?distance=${distance}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error obteniendo psicólogos cercanos');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    getDirections,
    getNearbyPsychologists,
    loading,
    error
  };
};
```

### Componente de ejemplo
```javascript
// components/NearbyPsychologists.jsx
import { useState, useEffect } from 'react';
import { useMaps } from '../hooks/useMaps';

const NearbyPsychologists = () => {
  const [psychologists, setPsychologists] = useState([]);
  const [distance, setDistance] = useState(5);
  const { getNearbyPsychologists, getDirections, loading, error } = useMaps();

  const handleSearch = async () => {
    try {
      const result = await getNearbyPsychologists(distance);
      setPsychologists(result.psychologists);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleGetDirections = async (psychologistId) => {
    try {
      const result = await getDirections(psychologistId);
      // Abrir el enlace en una nueva pestaña
      window.open(result.directions.link, '_blank');
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div className="nearby-psychologists">
      <div className="search-controls">
        <input
          type="number"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
          placeholder="Distancia en km"
          min="1"
          max="50"
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? 'Buscando...' : 'Buscar Psicólogos'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="results">
        {psychologists.map((psychologist, index) => (
          <div key={index} className="psychologist-card">
            <h3>{psychologist.name}</h3>
            <p>Email: {psychologist.email}</p>
            <p>Dirección: {psychologist.address}</p>
            <p>Distancia: {psychologist.distance}m</p>
            <button onClick={() => window.open(psychologist.link, '_blank')}>
              Ver Direcciones
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NearbyPsychologists;
```

## Consideraciones Importantes

### Autenticación
- Ambos endpoints requieren autenticación JWT
- El token debe incluirse en el header `Authorization` con el formato `Bearer <token>`
- El paciente autenticado será identificado automáticamente a partir del token

### Manejo de Errores
- Siempre implementa manejo de errores apropiado
- Los códigos de estado HTTP indican el tipo de error
- Los mensajes de error están en español

### Limitaciones
- La distancia en `/nearby` se mide en kilómetros
- El endpoint utiliza la API de Nominatim para geocodificación
- Los enlaces generados son de Google Maps

### Performance
- El endpoint `/nearby` puede tardar más tiempo si hay muchos psicólogos
- Se recomienda implementar indicadores de carga
- Considera implementar debouncing para búsquedas frecuentes

## Variables de Entorno Recomendadas

```bash
# .env.local (Next.js)
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

## Dependencias Frontend
```bash
npm install axios # Si prefieres axios sobre fetch
```