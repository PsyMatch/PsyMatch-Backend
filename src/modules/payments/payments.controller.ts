import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiConsumes,
} from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { ERole } from '../../common/enums/role.enum';

@ApiTags('Payments')
@Controller('payments')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  @Post()
  @Roles([ERole.PATIENT, ERole.ADMIN])
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Create a new payment',
    description:
      'Process a new payment for psychological services. Patients can create payments for their appointments.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        appointment_id: { type: 'string', example: 'appointment-uuid' },
        amount: { type: 'string', example: '150.00' },
        currency: { type: 'string', example: 'USD' },
        payment_method: { type: 'string', example: 'credit_card' },
        card_number: { type: 'string', example: '4111111111111111' },
        expiry_date: { type: 'string', example: '12/25' },
        cvv: { type: 'string', example: '123' },
        description: { type: 'string', example: 'Payment for therapy session' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Payment processed successfully',
    schema: {
      type: 'object',
      properties: {
        payment_id: { type: 'string', example: 'payment-uuid' },
        amount: { type: 'number', example: 150.0 },
        currency: { type: 'string', example: 'USD' },
        payment_method: { type: 'string', example: 'CREDIT_CARD' },
        status: { type: 'string', example: 'COMPLETED' },
        transaction_id: {
          type: 'string',
          example: 'txn_1234567890abcdef',
        },
        user_id: { type: 'string', example: 'user-uuid' },
        psychologist_id: { type: 'string', example: 'psychologist-uuid' },
        appointment_id: { type: 'string', example: 'appointment-uuid' },
        created_at: {
          type: 'string',
          format: 'date-time',
          example: '2024-03-15T10:00:00Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid payment data or payment processing failed',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired token',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied - Patient or Admin role required',
  })
  create(@Body() dto: CreatePaymentDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles([ERole.ADMIN])
  @ApiOperation({
    summary: 'Get all payments (Admin only)',
    description:
      'Retrieve all payments in the system. Only accessible by administrators.',
  })
  @ApiResponse({
    status: 200,
    description: 'Payments retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          payment_id: { type: 'string', example: 'payment-uuid' },
          amount: { type: 'number', example: 150.0 },
          currency: { type: 'string', example: 'USD' },
          payment_method: { type: 'string', example: 'CREDIT_CARD' },
          status: { type: 'string', example: 'COMPLETED' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'user-uuid' },
              name: { type: 'string', example: 'Juan Pérez' },
              email: { type: 'string', example: 'juan.perez@email.com' },
            },
          },
          psychologist: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'psychologist-uuid' },
              name: { type: 'string', example: 'Dr. Ana García' },
              email: { type: 'string', example: 'ana.garcia@psychologist.com' },
            },
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            example: '2024-03-15T10:00:00Z',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired token',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied - Admin role required',
  })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles([ERole.PATIENT, ERole.PSYCHOLOGIST, ERole.ADMIN])
  @ApiOperation({
    summary: 'Get payment by ID',
    description:
      'Retrieve a specific payment by its ID. Users can only view their own payments unless they are admins.',
  })
  @ApiParam({
    name: 'id',
    description: 'Payment UUID',
    example: 'payment-uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        payment_id: { type: 'string', example: 'payment-uuid' },
        amount: { type: 'number', example: 150.0 },
        currency: { type: 'string', example: 'USD' },
        payment_method: { type: 'string', example: 'CREDIT_CARD' },
        status: { type: 'string', example: 'COMPLETED' },
        transaction_id: {
          type: 'string',
          example: 'txn_1234567890abcdef',
        },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'user-uuid' },
            name: { type: 'string', example: 'Juan Pérez' },
            email: { type: 'string', example: 'juan.perez@email.com' },
          },
        },
        psychologist: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'psychologist-uuid' },
            name: { type: 'string', example: 'Dr. Ana García' },
            email: { type: 'string', example: 'ana.garcia@psychologist.com' },
          },
        },
        appointment: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'appointment-uuid' },
            date: {
              type: 'string',
              format: 'date-time',
              example: '2024-03-15T10:00:00Z',
            },
          },
        },
        created_at: {
          type: 'string',
          format: 'date-time',
          example: '2024-03-15T10:00:00Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired token',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied - Insufficient permissions',
  })
  @ApiResponse({
    status: 404,
    description: 'Payment not found',
  })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @Roles([ERole.ADMIN])
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Update payment by ID (Admin only)',
    description:
      'Update payment details such as status or refund information. Only administrators can update payments.',
  })
  @ApiParam({
    name: 'id',
    description: 'Payment UUID',
    example: 'payment-uuid',
  })
  @ApiBody({
    description: 'Update payment data (form-data)',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          description: 'Payment status',
          enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'],
          example: 'COMPLETED',
        },
        refund_amount: {
          type: 'string',
          description: 'Refund amount (if applicable)',
          example: '50.00',
        },
        refund_reason: {
          type: 'string',
          description: 'Reason for refund',
          example: 'Customer request',
        },
        notes: {
          type: 'string',
          description: 'Additional notes',
          example: 'Processed manually',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Payment updated successfully',
    schema: {
      type: 'object',
      properties: {
        payment_id: { type: 'string', example: 'payment-uuid' },
        amount: { type: 'number', example: 150.0 },
        status: { type: 'string', example: 'REFUNDED' },
        updated_at: {
          type: 'string',
          format: 'date-time',
          example: '2024-03-15T11:00:00Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid update data',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired token',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied - Admin role required',
  })
  @ApiResponse({
    status: 404,
    description: 'Payment not found',
  })
  update(@Param('id') id: string, @Body() dto: UpdatePaymentDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles([ERole.ADMIN])
  @ApiOperation({
    summary: 'Delete payment by ID (Admin only)',
    description:
      'Remove a payment record from the system. Only administrators can delete payments.',
  })
  @ApiParam({
    name: 'id',
    description: 'Payment UUID',
    example: 'payment-uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Payment deleted successfully',
        },
        payment_id: { type: 'string', example: 'payment-uuid' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired token',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied - Admin role required',
  })
  @ApiResponse({
    status: 404,
    description: 'Payment not found',
  })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
