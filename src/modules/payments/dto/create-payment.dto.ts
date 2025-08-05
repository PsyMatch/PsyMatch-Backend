import { IsUUID, IsEnum, IsNumber } from 'class-validator';
import { PayMethod, PayStatus } from '../entities/payment.entity';

export class CreatePaymentDto {
  @IsUUID()
  appointment_id: string;

  @IsNumber()
  amount: number;

  @IsEnum(PayMethod)
  pay_method: PayMethod;

  @IsEnum(PayStatus)
  pay_status?: PayStatus;
}
