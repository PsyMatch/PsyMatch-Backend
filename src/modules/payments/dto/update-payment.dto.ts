import { PartialType } from '@nestjs/mapped-types';
import { CreatePaymentDto } from './create-payment.dto';
import {
  IsOptional,
  IsEnum,
  IsNumber,
  IsUUID,
  IsString,
} from 'class-validator';
import { PayMethod, PayStatus } from '../entities/payment.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {
  @ApiPropertyOptional({ description: 'Appointment ID (UUID)' })
  @IsOptional()
  @IsUUID()
  appointment_id?: string;

  @ApiPropertyOptional({ description: 'Amount decimal' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  amount?: number;

  @ApiPropertyOptional({ enum: PayMethod })
  @IsOptional()
  @IsEnum(PayMethod)
  pay_method?: PayMethod;

  @ApiPropertyOptional({ enum: PayStatus })
  @IsOptional()
  @IsEnum(PayStatus)
  pay_status?: PayStatus;

  @ApiPropertyOptional({ description: 'Notes or admin comments' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Refund amount decimal' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  refund_amount?: number;
}
