import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum MercadoPagoStatus {
  APPROVED = 'approved',
  PENDING = 'pending',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  CHARGED_BACK = 'charged_back',
}

export class WebhookPaymentDto {
  @ApiProperty({
    description: 'ID de la acción que desencadenó el webhook',
    example: '12345678',
  })
  @IsOptional()
  @IsString()
  action?: string;

  @ApiProperty({
    description: 'Endpoint de la API de MercadoPago',
    example: '/v1/payments/12345678',
  })
  @IsOptional()
  @IsString()
  api_version?: string;

  @ApiProperty({
    description: 'Datos del pago',
    type: 'object',
  })
  @IsOptional()
  data?: {
    id: string;
  };

  @ApiProperty({
    description: 'Fecha y hora del evento',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsString()
  date_created?: string;

  @ApiProperty({
    description: 'ID único del evento',
    example: '12345678',
  })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({
    description: 'Si el webhook está en modo live',
    example: true,
  })
  @IsOptional()
  live_mode?: boolean;

  @ApiProperty({
    description: 'Tipo de notificación',
    example: 'payment',
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({
    description: 'ID del usuario de MercadoPago',
    example: '12345678',
  })
  @IsOptional()
  @IsString()
  user_id?: string;
}

export class MercadoPagoPaymentData {
  @ApiProperty({ description: 'ID del pago en MercadoPago' })
  id: string;

  @ApiProperty({ description: 'Estado del pago' })
  @IsEnum(MercadoPagoStatus)
  status: MercadoPagoStatus;

  @ApiProperty({ description: 'Monto del pago' })
  @IsNumber()
  transaction_amount: number;

  @ApiProperty({ description: 'Moneda del pago' })
  @IsString()
  currency_id: string;

  @ApiProperty({ description: 'ID de la preferencia de pago' })
  @IsOptional()
  @IsString()
  preference_id?: string;

  @ApiProperty({ description: 'Email del pagador' })
  @IsOptional()
  @IsString()
  payer?: {
    email: string;
    identification?: {
      type: string;
      number: string;
    };
  };

  @ApiProperty({ description: 'Fecha de creación' })
  @IsOptional()
  @IsString()
  date_created?: string;

  @ApiProperty({ description: 'Fecha de aprobación' })
  @IsOptional()
  @IsString()
  date_approved?: string;

  @ApiProperty({ description: 'Metadatos adicionales' })
  @IsOptional()
  metadata?: any;
}
