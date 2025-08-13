import {
  IsUUID,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PayMethod, PayStatus } from '../entities/payment.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'Appointment ID for which the payment is made',
    example: 'a1b2c3d4-e5f6-7890-abcd-1234567890ab',
  })
  @IsUUID()
  appointment_id: string;

  @ApiProperty({
    description: 'Amount to pay (decimal). Example: 150.00',
    example: 150.0,
  })
  @IsNumber()
  @Type(() => Number)
  amount: number;

  @ApiProperty({
    description: 'Currency (ISO code). Default: USD',
    example: 'USD',
  })
  @IsOptional()
  @IsString()
  currency?: string = 'USD';

  @ApiProperty({
    description: 'Payment method',
    enum: PayMethod,
  })
  @IsEnum(PayMethod)
  pay_method: PayMethod;

  @ApiPropertyOptional({
    description: 'Optional initial payment status (default PENDING)',
    enum: PayStatus,
  })
  @IsOptional()
  @IsEnum(PayStatus)
  pay_status?: PayStatus;
}
