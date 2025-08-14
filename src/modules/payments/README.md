# Módulo de Pagos (Payments)

## Descripción General

El módulo de **Payments** gestiona todo el procesamiento de pagos y facturación de PsyMatch. Proporciona un sistema completo para manejar transacciones de servicios psicológicos, incluyendo pagos de citas, reembolsos, y administración financiera con múltiples métodos de pago y control de estados.

## Funcionalidades Principales

### 💳 Procesamiento de Pagos

- **Múltiples métodos**: Tarjetas de crédito, débito, PayPal, transferencias
- **Gestión de estados**: Pendiente, completado, fallido, reembolsado
- **Validación de transacciones**: Verificación de datos y montos
- **Historial completo**: Registro detallado de todas las transacciones

### 💰 Gestión Financiera

- **Facturación automática**: Generación de facturas por citas
- **Reembolsos**: Sistema de devoluciones con tracking
- **Monedas múltiples**: Soporte USD y otras monedas
- **Comisiones**: Cálculo automático de comisiones por plataforma

### 🔒 Seguridad y Cumplimiento

- **Encriptación de datos**: Protección de información financiera
- **Auditoría completa**: Logs de todas las transacciones
- **Control de acceso**: Permisos basados en roles
- **Cumplimiento PCI**: Estándares de seguridad financiera

## Estructura del Módulo

```
payments/
├── payments.controller.ts      # Controlador REST API
├── payments.service.ts         # Lógica de negocio
├── payments.module.ts          # Configuración del módulo
├── dto/
│   ├── create-payment.dto.ts   # DTO para crear pagos
│   └── update-payment.dto.ts   # DTO para actualizar pagos
└── entities/
    └── payment.entity.ts       # Entidad de base de datos
```

## Entidad Payment

### 🏛️ Esquema de Base de Datos

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

### 📊 Enums del Sistema

#### Estados de Pago

```typescript
export enum PayStatus {
  PENDING = 'PENDING', // Pago pendiente de procesamiento
  COMPLETED = 'COMPLETED', // Pago completado exitosamente
  FAILED = 'FAILED', // Pago fallido
  REFUNDED = 'REFUNDED', // Pago reembolsado
}
```

#### Métodos de Pago

```typescript
export enum PayMethod {
  CREDIT_CARD = 'CREDIT_CARD', // Tarjeta de crédito
  DEBIT_CARD = 'DEBIT_CARD', // Tarjeta de débito
  PAYPAL = 'PAYPAL', // PayPal
  BANK_TRANSFER = 'BANK_TRANSFER', // Transferencia bancaria
}
```

## API Endpoints

### 🔹 POST `/payments` - Crear Pago

**Descripción**: Procesa un nuevo pago por servicios psicológicos.

**Roles permitidos**: `PATIENT`, `ADMIN`

**Request Body**:

```json
{
  "appointment_id": "appointment-uuid",
  "amount": 150.0,
  "currency": "USD",
  "pay_method": "CREDIT_CARD",
  "pay_status": "PENDING"
}
```

**Response** (201):

```json
{
  "payment_id": "payment-uuid",
  "appointment_id": "appointment-uuid",
  "amount": 150.0,
  "currency": "USD",
  "pay_method": "CREDIT_CARD",
  "pay_status": "COMPLETED",
  "created_at": "2024-03-15T10:00:00Z",
  "updated_at": "2024-03-15T10:00:00Z"
}
```

### 🔹 GET `/payments` - Obtener Todos los Pagos

**Descripción**: Recupera todos los pagos del sistema (solo administradores).

**Roles permitidos**: `ADMIN`

**Response** (200):

```json
[
  {
    "payment_id": "payment-uuid",
    "amount": 150.0,
    "currency": "USD",
    "pay_method": "CREDIT_CARD",
    "pay_status": "COMPLETED",
    "appointment": {
      "id": "appointment-uuid",
      "date": "2024-03-15T10:00:00Z",
      "patient": {
        "id": "patient-uuid",
        "name": "Juan Pérez",
        "email": "juan@email.com"
      },
      "psychologist": {
        "id": "psychologist-uuid",
        "name": "Dr. Ana García",
        "email": "ana@psychologist.com"
      }
    },
    "created_at": "2024-03-15T09:45:00Z"
  }
]
```

### 🔹 GET `/payments/:id` - Obtener Pago por ID

**Descripción**: Recupera un pago específico por su ID.

**Roles permitidos**: `PATIENT`, `PSYCHOLOGIST`, `ADMIN`

**Parámetros**:

- `id` (string): UUID del pago

**Response** (200):

```json
{
  "payment_id": "payment-uuid",
  "appointment_id": "appointment-uuid",
  "amount": 150.0,
  "currency": "USD",
  "pay_method": "CREDIT_CARD",
  "pay_status": "COMPLETED",
  "notes": "Pago por sesión de terapia",
  "refund_amount": null,
  "created_at": "2024-03-15T10:00:00Z",
  "updated_at": "2024-03-15T10:00:00Z"
}
```

### 🔹 PUT `/payments/:id` - Actualizar Pago

**Descripción**: Actualiza un pago existente (solo administradores).

**Roles permitidos**: `ADMIN`

**Request Body**:

```json
{
  "pay_status": "REFUNDED",
  "refund_amount": 50.0,
  "notes": "Reembolso parcial por cancelación anticipada"
}
```

**Response** (200):

```json
{
  "payment_id": "payment-uuid",
  "amount": 150.0,
  "pay_status": "REFUNDED",
  "refund_amount": 50.0,
  "notes": "Reembolso parcial por cancelación anticipada",
  "updated_at": "2024-03-15T11:00:00Z"
}
```

### 🔹 DELETE `/payments/:id` - Eliminar Pago

**Descripción**: Elimina un registro de pago (solo administradores).

**Roles permitidos**: `ADMIN`

**Response** (200):

```json
{
  "message": "Pago eliminado exitosamente",
  "payment_id": "payment-uuid"
}
```

## Integración con Frontend (Next.js)

### 🔧 Cliente de Pagos

```typescript
// lib/payments.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const paymentsApi = {
  // Crear pago
  createPayment: async (paymentData: CreatePaymentData, token: string) => {
    const response = await fetch(`${API_BASE_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error processing payment');
    }

    return response.json();
  },

  // Obtener pagos del usuario
  getUserPayments: async (userId: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/payments/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error fetching payments');
    }

    return response.json();
  },

  // Obtener pago por ID
  getPaymentById: async (paymentId: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Payment not found');
    }

    return response.json();
  },

  // Solicitar reembolso
  requestRefund: async (paymentId: string, reason: string, token: string) => {
    const response = await fetch(
      `${API_BASE_URL}/payments/${paymentId}/refund`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      },
    );

    if (!response.ok) {
      throw new Error('Error requesting refund');
    }

    return response.json();
  },
};

// Tipos TypeScript
export interface CreatePaymentData {
  appointment_id: string;
  amount: number;
  currency?: string;
  pay_method: 'CREDIT_CARD' | 'DEBIT_CARD' | 'PAYPAL' | 'BANK_TRANSFER';
}

export interface Payment {
  payment_id: string;
  appointment_id: string;
  amount: number;
  currency: string;
  pay_method: string;
  pay_status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  notes?: string;
  refund_amount?: number;
  created_at: string;
  updated_at: string;
}
```

### 💳 Componente de Procesamiento de Pago

```typescript
// components/PaymentProcessor.tsx
'use client';

import { useState } from 'react';
import { paymentsApi } from '../lib/payments';
import { useAuth } from '../context/AuthContext';

interface PaymentProcessorProps {
  appointmentId: string;
  amount: number;
  psychologistName: string;
  onPaymentSuccess?: (payment: any) => void;
  onPaymentError?: (error: string) => void;
}

export default function PaymentProcessor({
  appointmentId,
  amount,
  psychologistName,
  onPaymentSuccess,
  onPaymentError
}: PaymentProcessorProps) {
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
  const [processing, setProcessing] = useState(false);
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const { user } = useAuth();

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authenticated');
      }

      const paymentData = {
        appointment_id: appointmentId,
        amount: amount,
        currency: 'USD',
        pay_method: paymentMethod as any
      };

      const response = await paymentsApi.createPayment(paymentData, token);

      onPaymentSuccess?.(response);
      alert('Pago procesado exitosamente');

    } catch (error: any) {
      onPaymentError?.(error.message);
      alert(`Error en el pago: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="payment-processor bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Procesar Pago</h3>
        <p className="text-gray-600 mt-2">
          Sesión con {psychologistName}
        </p>
        <div className="text-2xl font-bold text-green-600 mt-2">
          ${amount.toFixed(2)} USD
        </div>
      </div>

      <form onSubmit={handlePayment} className="space-y-4">
        {/* Método de pago */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Método de Pago
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="CREDIT_CARD">Tarjeta de Crédito</option>
            <option value="DEBIT_CARD">Tarjeta de Débito</option>
            <option value="PAYPAL">PayPal</option>
            <option value="BANK_TRANSFER">Transferencia Bancaria</option>
          </select>
        </div>

        {/* Información de tarjeta (solo para tarjetas) */}
        {(paymentMethod === 'CREDIT_CARD' || paymentMethod === 'DEBIT_CARD') && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Tarjeta
              </label>
              <input
                type="text"
                value={cardData.number}
                onChange={(e) => setCardData({...cardData, number: e.target.value})}
                placeholder="1234 5678 9012 3456"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Expiración
                </label>
                <input
                  type="text"
                  value={cardData.expiry}
                  onChange={(e) => setCardData({...cardData, expiry: e.target.value})}
                  placeholder="MM/AA"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVV
                </label>
                <input
                  type="text"
                  value={cardData.cvv}
                  onChange={(e) => setCardData({...cardData, cvv: e.target.value})}
                  placeholder="123"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre en la Tarjeta
              </label>
              <input
                type="text"
                value={cardData.name}
                onChange={(e) => setCardData({...cardData, name: e.target.value})}
                placeholder="Juan Pérez"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </>
        )}

        {/* PayPal */}
        {paymentMethod === 'PAYPAL' && (
          <div className="bg-blue-50 p-4 rounded-md">
            <p className="text-sm text-blue-700">
              Serás redirigido a PayPal para completar el pago de forma segura.
            </p>
          </div>
        )}

        {/* Transferencia bancaria */}
        {paymentMethod === 'BANK_TRANSFER' && (
          <div className="bg-yellow-50 p-4 rounded-md">
            <p className="text-sm text-yellow-700">
              Recibirás instrucciones de transferencia bancaria por email después de confirmar.
            </p>
          </div>
        )}

        {/* Botón de pago */}
        <button
          type="submit"
          disabled={processing}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando...
            </div>
          ) : (
            `Pagar $${amount.toFixed(2)}`
          )}
        </button>
      </form>

      {/* Información de seguridad */}
      <div className="mt-4 text-center">
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span>Pago seguro y encriptado</span>
        </div>
      </div>
    </div>
  );
}
```

### 📊 Componente de Historial de Pagos

```typescript
// components/PaymentHistory.tsx
'use client';

import { useEffect, useState } from 'react';
import { paymentsApi } from '../lib/payments';
import { useAuth } from '../context/AuthContext';

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token || !user) return;

        const data = await paymentsApi.getUserPayments(user.id, token);
        setPayments(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [user]);

  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      COMPLETED: 'bg-green-100 text-green-800',
      FAILED: 'bg-red-100 text-red-800',
      REFUNDED: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts = {
      PENDING: 'Pendiente',
      COMPLETED: 'Completado',
      FAILED: 'Fallido',
      REFUNDED: 'Reembolsado'
    };
    return texts[status] || status;
  };

  const getPaymentMethodText = (method: string) => {
    const methods = {
      CREDIT_CARD: 'Tarjeta de Crédito',
      DEBIT_CARD: 'Tarjeta de Débito',
      PAYPAL: 'PayPal',
      BANK_TRANSFER: 'Transferencia Bancaria'
    };
    return methods[method] || method;
  };

  if (loading) return <div>Cargando historial de pagos...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div className="payment-history">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Historial de Pagos</h2>

      {payments.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No tienes pagos registrados aún.
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((payment: any) => (
            <div key={payment.payment_id} className="bg-white border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-semibold text-lg">
                      ${payment.amount.toFixed(2)} {payment.currency}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.pay_status)}`}>
                      {getStatusText(payment.pay_status)}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-1">
                    <strong>Método:</strong> {getPaymentMethodText(payment.pay_method)}
                  </p>

                  <p className="text-gray-600 text-sm mb-1">
                    <strong>Fecha:</strong> {new Date(payment.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>

                  {payment.appointment && (
                    <p className="text-gray-600 text-sm mb-1">
                      <strong>Cita:</strong> {new Date(payment.appointment.date).toLocaleDateString('es-ES')}
                      {payment.appointment.psychologist && (
                        <span> - Dr. {payment.appointment.psychologist.name}</span>
                      )}
                    </p>
                  )}

                  {payment.refund_amount && (
                    <p className="text-blue-600 text-sm">
                      <strong>Reembolso:</strong> ${payment.refund_amount.toFixed(2)}
                    </p>
                  )}

                  {payment.notes && (
                    <p className="text-gray-500 text-sm mt-2">
                      <strong>Notas:</strong> {payment.notes}
                    </p>
                  )}
                </div>

                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => window.open(`/payments/${payment.payment_id}/receipt`, '_blank')}
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    Ver Recibo
                  </button>

                  {payment.pay_status === 'COMPLETED' && (
                    <button
                      onClick={() => {
                        const reason = prompt('Motivo del reembolso:');
                        if (reason) {
                          // Llamar API de reembolso
                          console.log('Solicitar reembolso:', payment.payment_id, reason);
                        }
                      }}
                      className="text-orange-600 hover:text-orange-800 text-sm underline"
                    >
                      Solicitar Reembolso
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### 🔒 Hook para Gestión de Pagos

```typescript
// hooks/usePayments.ts
import { useState, useEffect } from 'react';
import { paymentsApi } from '../lib/payments';
import { useAuth } from '../context/AuthContext';

export function usePayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');

      if (!token || !user) {
        throw new Error('No authenticated');
      }

      const data = await paymentsApi.getUserPayments(user.id, token);
      setPayments(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createPayment = async (paymentData: any) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authenticated');
      }

      const newPayment = await paymentsApi.createPayment(paymentData, token);
      setPayments((prev) => [newPayment, ...prev]);
      return newPayment;
    } catch (err) {
      throw err;
    }
  };

  const requestRefund = async (paymentId: string, reason: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authenticated');
      }

      await paymentsApi.requestRefund(paymentId, reason, token);

      // Actualizar el estado local
      setPayments((prev) =>
        prev.map((payment) =>
          payment.payment_id === paymentId
            ? { ...payment, pay_status: 'REFUNDED' }
            : payment,
        ),
      );
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [user]);

  return {
    payments,
    loading,
    error,
    refetch: fetchPayments,
    createPayment,
    requestRefund,
  };
}
```

## Validaciones y Reglas de Negocio

### 📋 Validaciones de DTO

#### CreatePaymentDto

```typescript
export class CreatePaymentDto {
  @IsUUID()
  appointment_id: string; // UUID válido de cita

  @IsNumber()
  @Type(() => Number)
  amount: number; // Monto decimal positivo

  @IsOptional()
  @IsString()
  currency?: string = 'USD'; // Código de moneda ISO

  @IsEnum(PayMethod)
  pay_method: PayMethod; // Método de pago válido

  @IsOptional()
  @IsEnum(PayStatus)
  pay_status?: PayStatus; // Estado inicial (default: PENDING)
}
```

#### UpdatePaymentDto

```typescript
export class UpdatePaymentDto {
  @IsOptional()
  @IsEnum(PayStatus)
  pay_status?: PayStatus; // Actualización de estado

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  refund_amount?: number; // Monto de reembolso

  @IsOptional()
  @IsString()
  notes?: string; // Notas administrativas
}
```

### 🔒 Control de Acceso por Roles

#### Permisos por Endpoint

- **CREATE**: `PATIENT`, `ADMIN` - Los pacientes pueden crear pagos para sus citas
- **READ ALL**: `ADMIN` - Solo administradores ven todos los pagos
- **READ ONE**: `PATIENT`, `PSYCHOLOGIST`, `ADMIN` - Acceso controlado por ownership
- **UPDATE**: `ADMIN` - Solo administradores pueden modificar pagos
- **DELETE**: `ADMIN` - Solo administradores pueden eliminar registros

## Seguridad de Pagos

### 🛡️ Medidas de Seguridad

#### Encriptación de Datos

```typescript
// utils/payment-security.ts
import crypto from 'crypto';

export class PaymentSecurity {
  private static readonly ENCRYPTION_KEY = process.env.PAYMENT_ENCRYPTION_KEY;

  static encryptCardData(cardData: string): string {
    const cipher = crypto.createCipher('aes-256-cbc', this.ENCRYPTION_KEY);
    let encrypted = cipher.update(cardData, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  static decryptCardData(encryptedData: string): string {
    const decipher = crypto.createDecipher('aes-256-cbc', this.ENCRYPTION_KEY);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  static maskCardNumber(cardNumber: string): string {
    // Mostrar solo los últimos 4 dígitos
    return '**** **** **** ' + cardNumber.slice(-4);
  }
}
```

#### Validación de Transacciones

```typescript
// utils/payment-validator.ts
export class PaymentValidator {
  static validateAmount(amount: number): boolean {
    return amount > 0 && amount <= 10000; // Límite máximo
  }

  static validateCurrency(currency: string): boolean {
    const supportedCurrencies = ['USD', 'EUR', 'ARS'];
    return supportedCurrencies.includes(currency);
  }

  static validateCardNumber(cardNumber: string): boolean {
    // Algoritmo de Luhn para validar números de tarjeta
    const digits = cardNumber.replace(/\D/g, '');
    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }
}
```

## Integración con Procesadores de Pago

### 💳 Stripe Integration (Ejemplo)

```typescript
// services/stripe.service.ts
import Stripe from 'stripe';

export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }

  async createPaymentIntent(amount: number, currency: string = 'usd') {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convertir a centavos
        currency,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return paymentIntent;
    } catch (error) {
      throw new Error(`Stripe error: ${error.message}`);
    }
  }

  async confirmPayment(paymentIntentId: string) {
    try {
      const paymentIntent =
        await this.stripe.paymentIntents.confirm(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      throw new Error(`Payment confirmation failed: ${error.message}`);
    }
  }

  async createRefund(paymentIntentId: string, amount?: number) {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined,
      });

      return refund;
    } catch (error) {
      throw new Error(`Refund failed: ${error.message}`);
    }
  }
}
```

### 🏦 PayPal Integration (Ejemplo)

```typescript
// services/paypal.service.ts
import paypal from '@paypal/checkout-server-sdk';

export class PayPalService {
  private client: paypal.core.PayPalHttpClient;

  constructor() {
    const environment =
      process.env.NODE_ENV === 'production'
        ? new paypal.core.LiveEnvironment(
            process.env.PAYPAL_CLIENT_ID,
            process.env.PAYPAL_CLIENT_SECRET,
          )
        : new paypal.core.SandboxEnvironment(
            process.env.PAYPAL_CLIENT_ID,
            process.env.PAYPAL_CLIENT_SECRET,
          );

    this.client = new paypal.core.PayPalHttpClient(environment);
  }

  async createOrder(amount: number, currency: string = 'USD') {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount.toFixed(2),
          },
        },
      ],
    });

    try {
      const order = await this.client.execute(request);
      return order;
    } catch (error) {
      throw new Error(`PayPal order creation failed: ${error.message}`);
    }
  }

  async captureOrder(orderId: string) {
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    try {
      const capture = await this.client.execute(request);
      return capture;
    } catch (error) {
      throw new Error(`PayPal capture failed: ${error.message}`);
    }
  }
}
```

## Reportes y Analytics

### 📊 Dashboard de Administración

```typescript
// components/PaymentsDashboard.tsx
'use client';

import { useEffect, useState } from 'react';

export default function PaymentsDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    successRate: 0,
    averageTransaction: 0,
    recentPayments: []
  });

  useEffect(() => {
    // Cargar estadísticas de pagos
    fetchPaymentStats();
  }, []);

  const fetchPaymentStats = async () => {
    try {
      const response = await fetch('/api/admin/payment-stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error loading payment stats:', error);
    }
  };

  return (
    <div className="payments-dashboard p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard de Pagos</h1>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Ingresos Totales</h3>
          <p className="text-3xl font-bold text-green-600">
            ${stats.totalRevenue.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Transacciones</h3>
          <p className="text-3xl font-bold text-blue-600">
            {stats.totalTransactions.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Tasa de Éxito</h3>
          <p className="text-3xl font-bold text-purple-600">
            {stats.successRate.toFixed(1)}%
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Transacción Promedio</h3>
          <p className="text-3xl font-bold text-orange-600">
            ${stats.averageTransaction.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Lista de pagos recientes */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Pagos Recientes</h2>
        </div>
        <div className="p-6">
          {stats.recentPayments.map((payment: any) => (
            <div key={payment.payment_id} className="flex justify-between items-center py-3 border-b last:border-b-0">
              <div>
                <p className="font-medium">${payment.amount.toFixed(2)}</p>
                <p className="text-sm text-gray-500">{payment.user.name}</p>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  payment.pay_status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                  payment.pay_status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {payment.pay_status}
                </span>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(payment.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

## Manejo de Errores

### ❌ Errores Comunes

```typescript
// types/payment-errors.ts
export enum PaymentErrorTypes {
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
  INVALID_CARD = 'INVALID_CARD',
  EXPIRED_CARD = 'EXPIRED_CARD',
  PROCESSING_ERROR = 'PROCESSING_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  AMOUNT_TOO_LARGE = 'AMOUNT_TOO_LARGE',
  CURRENCY_NOT_SUPPORTED = 'CURRENCY_NOT_SUPPORTED',
}

export const PaymentErrorMessages = {
  [PaymentErrorTypes.INSUFFICIENT_FUNDS]: 'Fondos insuficientes',
  [PaymentErrorTypes.INVALID_CARD]: 'Tarjeta inválida',
  [PaymentErrorTypes.EXPIRED_CARD]: 'Tarjeta expirada',
  [PaymentErrorTypes.PROCESSING_ERROR]: 'Error al procesar el pago',
  [PaymentErrorTypes.NETWORK_ERROR]: 'Error de conexión',
  [PaymentErrorTypes.AMOUNT_TOO_LARGE]: 'Monto demasiado grande',
  [PaymentErrorTypes.CURRENCY_NOT_SUPPORTED]: 'Moneda no soportada',
};
```

### 🛠️ Manejo en Frontend

```typescript
// utils/payment-error-handler.ts
export const handlePaymentError = (error: any): string => {
  if (error.message.includes('insufficient')) {
    return PaymentErrorMessages.INSUFFICIENT_FUNDS;
  } else if (error.message.includes('invalid card')) {
    return PaymentErrorMessages.INVALID_CARD;
  } else if (error.message.includes('expired')) {
    return PaymentErrorMessages.EXPIRED_CARD;
  } else if (error.message.includes('amount')) {
    return PaymentErrorMessages.AMOUNT_TOO_LARGE;
  } else {
    return PaymentErrorMessages.PROCESSING_ERROR;
  }
};
```

## Consideraciones de Producción

### 🚀 Configuración para Producción

```typescript
// Configuración segura para producción
const productionPaymentConfig = {
  stripe: {
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },
  paypal: {
    clientId: process.env.PAYPAL_CLIENT_ID,
    clientSecret: process.env.PAYPAL_CLIENT_SECRET,
    environment: 'production',
  },
  security: {
    encryptionKey: process.env.PAYMENT_ENCRYPTION_KEY,
    maxAmount: 10000,
    rateLimitWindow: 900000, // 15 minutos
    rateLimitMax: 10, // 10 intentos por ventana
  },
};
```

### 📈 Monitoreo y Logs

```typescript
// services/payment-monitoring.ts
export class PaymentMonitoring {
  static async logTransaction(payment: any, status: string) {
    console.log(`Payment ${payment.payment_id}: ${status}`);

    // Enviar métricas a servicio de monitoring
    await this.sendMetrics({
      payment_id: payment.payment_id,
      amount: payment.amount,
      status,
      timestamp: new Date(),
    });
  }

  static async alertFailedPayment(payment: any, error: string) {
    console.error(`Payment failed: ${payment.payment_id} - ${error}`);

    // Enviar alerta crítica
    await this.sendAlert({
      type: 'payment_failure',
      payment_id: payment.payment_id,
      error,
      severity: 'high',
    });
  }
}
```

## Próximas Mejoras

- [ ] Integración con más procesadores de pago (Mercado Pago, Stripe Connect)
- [ ] Sistema de suscripciones recurrentes
- [ ] Facturación automática con PDF
- [ ] Dashboard avanzado con analytics
- [ ] Sistema de comisiones para psicólogos
- [ ] Pagos offline y diferidos
- [ ] Integración con sistemas contables
- [ ] Monitoreo de fraude con ML
- [ ] Soporte para criptomonedas
- [ ] Sistema de loyalty points y descuentos
