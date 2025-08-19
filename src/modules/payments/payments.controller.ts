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
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { ERole } from '../../common/enums/role.enum';
import { CombinedAuthGuard } from '../auth/guards/combined-auth.guard';

@ApiTags('Pagos')
@Controller('payments')
@UseGuards(CombinedAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  @Post('mercadopago-preference')
  @Roles([ERole.PATIENT, ERole.ADMIN])
  @ApiOperation({
    summary: 'Crear preferencia de pago de Mercado Pago',
    description:
      'Generar una preferencia de pago para Mercado Pago y devolver el init_point para redirección.',
  })
  @ApiResponse({
    status: 201,
    description: 'Preferencia creada exitosamente',
    schema: {
      type: 'object',
      properties: {
        init_point: {
          type: 'string',
          example:
            'https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=123',
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Error al crear la preferencia de pago',
  })
  async createMercadoPagoPreference() {
    return this.service.createMercadoPagoPreference();
  }

  @Post()
  @Roles([ERole.PATIENT, ERole.ADMIN])
  @ApiOperation({
    summary: 'Crear un nuevo pago',
    description:
      'Procesar un nuevo pago por servicios psicológicos. Los pacientes pueden crear pagos para sus citas.',
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
        description: { type: 'string', example: 'Pago por sesión de terapia' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Pago procesado exitosamente',
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
    description: 'Datos de pago inválidos o fallo en el procesamiento del pago',
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido o expirado',
  })
  @ApiResponse({
    status: 403,
    description:
      'Acceso denegado - Se requiere rol de Paciente o Administrador',
  })
  create(@Body() dto: CreatePaymentDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles([ERole.ADMIN])
  @ApiOperation({
    summary: 'Obtener todos los pagos (Solo administradores)',
    description:
      'Recuperar todos los pagos del sistema. Solo accesible por administradores.',
  })
  @ApiResponse({
    status: 200,
    description: 'Pagos recuperados exitosamente',
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
    description: 'Token inválido o expirado',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - Se requiere rol de administrador',
  })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles([ERole.PATIENT, ERole.PSYCHOLOGIST, ERole.ADMIN])
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiParam({ name: 'id', description: 'Payment UUID' })
  @ApiResponse({ status: 200, description: 'Payment retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  @ApiOperation({
    summary: 'Obtener pago por ID',
    description:
      'Recuperar un pago específico por su ID. Los usuarios solo pueden ver sus propios pagos a menos que sean administradores.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del pago',
    example: 'payment-uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Pago recuperado exitosamente',
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
    description: 'Token inválido o expirado',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - Permisos insuficientes',
  })
  @ApiResponse({
    status: 404,
    description: 'Pago no encontrado',
  })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @Roles([ERole.ADMIN])
  @ApiOperation({ summary: 'Update payment (admin only)' })
  @ApiParam({ name: 'id', description: 'Payment UUID' })
  @ApiBody({ type: UpdatePaymentDto })
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Actualizar pago por ID (Solo administradores)',
    description:
      'Actualizar detalles del pago como estado o información de reembolso. Solo los administradores pueden actualizar pagos.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del pago',
    example: 'payment-uuid',
  })
  @ApiBody({
    description: 'Datos de actualización del pago (form-data)',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          description: 'Estado del pago',
          enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'],
          example: 'COMPLETED',
        },
        refund_amount: {
          type: 'string',
          description: 'Monto de reembolso (si aplica)',
          example: '50.00',
        },
        refund_reason: {
          type: 'string',
          description: 'Razón del reembolso',
          example: 'Solicitud del cliente',
        },
        notes: {
          type: 'string',
          description: 'Notas adicionales',
          example: 'Procesado manualmente',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Pago actualizado exitosamente',
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
    description: 'Datos de actualización inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido o expirado',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - Se requiere rol de administrador',
  })
  @ApiResponse({
    status: 404,
    description: 'Pago no encontrado',
  })
  update(@Param('id') id: string, @Body() dto: UpdatePaymentDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles([ERole.ADMIN])
  @ApiOperation({ summary: 'Delete payment (admin only)' })
  @ApiParam({ name: 'id', description: 'Payment UUID' })
  @ApiOperation({
    summary: 'Eliminar pago por ID (Solo administradores)',
    description:
      'Remover un registro de pago del sistema. Solo los administradores pueden eliminar pagos.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del pago',
    example: 'payment-uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Pago eliminado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Pago eliminado exitosamente',
        },
        payment_id: { type: 'string', example: 'payment-uuid' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido o expirado',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - Se requiere rol de administrador',
  })
  @ApiResponse({
    status: 404,
    description: 'Pago no encontrado',
  })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
