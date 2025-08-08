import { PartialType } from '@nestjs/mapped-types';
import { CreatePaymentDto } from './create-payment.dto';
import { IsOptional, IsEnum, IsNumber, IsUUID } from 'class-validator';
import { PayMethod, PayStatus } from '../entities/payment.entity';

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {
  @IsOptional()
  @IsUUID()
  appointment_id?: string;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsEnum(PayMethod)
  pay_method?: PayMethod;

  @IsOptional()
  @IsEnum(PayStatus)
  pay_status?: PayStatus;
}
