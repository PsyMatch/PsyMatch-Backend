import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';

@ApiTags('Webhooks')
@Controller('payments')
export class WebhookController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('webhook')
  @ApiOperation({
    summary: 'Webhook de MercadoPago',
    description:
      'Recibe notificaciones de cambios de estado de pagos desde MercadoPago.',
  })
  @ApiResponse({
    status: 200,
    description: 'Webhook procesado exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Error al procesar el webhook',
  })
  async handleWebhook(
    @Body() webhookData: { type?: string; data?: { id?: string } },
  ) {
    await this.paymentsService.handleWebhook(webhookData);
    return { status: 'ok' };
  }
}
