export enum AppointmentStatus {
  PENDING = 'pending', // Mantener para compatibilidad - equivale a PENDING_PAYMENT
  PENDING_PAYMENT = 'pending_payment',
  PENDING_APPROVAL = 'pending_approval',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}
