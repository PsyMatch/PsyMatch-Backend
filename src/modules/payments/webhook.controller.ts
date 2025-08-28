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

  @Post('test-webhook')
  @ApiOperation({
    summary: 'Endpoint de prueba para webhook',
    description: 'Permite probar manualmente el procesamiento de webhooks',
  })
  async testWebhook(
    @Body() testData: { paymentId: string; appointmentId: string },
  ) {
    // Simular webhook de MercadoPago
    const webhookData = {
      type: 'payment',
      data: { id: testData.paymentId }
    };
    
    await this.paymentsService.handleWebhook(webhookData);
    return { 
      status: 'test-ok',
      message: 'Test webhook procesado',
      data: testData
    };
  }
}
