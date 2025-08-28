import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PayStatus, PayMethod } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import {
  MercadoPagoConfig,
  Preference,
  Payment as MPPayment,
} from 'mercadopago';
import { envs } from '../../configs/envs.config';
import { Appointment } from '../appointments/entities/appointment.entity';
import { AppointmentStatus } from '../appointments/enums/appointment-status.enum';

interface MPPreferenceResult {
  init_point?: string;
  id?: string;
}

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,
    @InjectRepository(Appointment)
    private readonly appointmentsRepository: Repository<Appointment>,
  ) {}

  async create(dto: CreatePaymentDto): Promise<Payment> {
    const payment = this.paymentsRepository.create(dto);

    try {
      return await this.paymentsRepository.save(payment);
    } catch {
      payment.pay_status = PayStatus.FAILED;
      return await this.paymentsRepository.save(payment);
    }
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentsRepository.find();
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne({
      where: { payment_id: id },
    });

    if (!payment) {
      throw new NotFoundException(`Pago con ID ${id} no encontrado`);
    }

    return payment;
  }

  async update(id: string, dto: UpdatePaymentDto): Promise<Payment> {
    const payment = await this.findOne(id);

    if (dto.appointment_id) payment.appointment_id = dto.appointment_id;
    if (dto.amount) payment.amount = dto.amount;
    if (dto.currency) payment.currency = dto.currency;
    if (dto.pay_method) payment.pay_method = dto.pay_method;
    if (dto.pay_status) payment.pay_status = dto.pay_status;
    if (dto.notes) payment.notes = dto.notes;
    if (dto.refund_amount) payment.refund_amount = dto.refund_amount;

    return this.paymentsRepository.save(payment);
  }

  async remove(id: string): Promise<void> {
    const result = await this.paymentsRepository.delete({ payment_id: id });

    if (result.affected === 0) {
      throw new NotFoundException(`Pago con ID ${id} no encontrado`);
    }
  }

  async createMercadoPagoPreference(
    userId?: string,
    appointmentId?: string,
    amount?: number,
  ): Promise<{ init_point: string; preference_id: string }> {
    const accessToken = envs.mercadopago.accessToken;
    const frontendUrl = envs.deployed_urls.frontend || 'http://localhost:3000';
    const backendUrl = envs.deployed_urls.backend || 'http://localhost:8080';

    if (!accessToken) {
      throw new BadRequestException(
        'El token de acceso de MercadoPago no está configurado',
      );
    }

    if (!frontendUrl) {
      throw new BadRequestException('La URL del frontend no está configurada');
    }

    try {
      const client = new MercadoPagoConfig({
        accessToken,
      });

      const preference = new Preference(client);

      const metadata: Record<string, string> = {};
      if (userId) metadata.user_id = userId;
      if (appointmentId) metadata.appointment_id = appointmentId;

      // Usar el monto proporcionado o un valor por defecto
      const sessionPrice = amount || 5000; // Precio por defecto en centavos (50 ARS)

      const result: MPPreferenceResult = await preference.create({
        body: {
          items: [
            {
              id: 'therapy_session',
              title: 'Sesión de Terapia',
              quantity: 1,
              unit_price: sessionPrice,
              currency_id: 'ARS',
            },
          ],
          back_urls: {
            success: `${frontendUrl}/payment/success`,
            failure: `${frontendUrl}/payment/failure`,
            pending: `${frontendUrl}/payment/pending`,
          },
          auto_return: 'approved',
          metadata,
          notification_url: `${backendUrl}/payments/webhook`,
        },
      });

      if (!result?.init_point || !result?.id) {
        throw new BadRequestException(
          'Fallo al crear la preferencia de MercadoPago',
        );
      }

      return { init_point: result.init_point, preference_id: result.id };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        'Fallo al crear la preferencia de MercadoPago',
      );
    }
  }

  async handleWebhook(webhookData: {
    type?: string;
    data?: { id?: string };
  }): Promise<void> {
    try {
      if (webhookData.type === 'payment' && webhookData.data?.id) {
        const paymentId = webhookData.data.id;
        await this.processPaymentWebhook(paymentId);
      }
    } catch (error) {
      console.error('Error procesando webhook:', error);
      throw new BadRequestException('Error procesando webhook');
    }
  }

  private async processPaymentWebhook(paymentId: string): Promise<void> {
    try {
      const accessToken = envs.mercadopago.accessToken;
      const client = new MercadoPagoConfig({ accessToken });
      const payment = new MPPayment(client);

      const paymentData = await payment.get({ id: paymentId });

      if (paymentData && paymentData.status === 'approved') {
        // Buscar si ya existe un pago con este mercado_pago_id
        let existingPayment = await this.paymentsRepository.findOne({
          where: { mercado_pago_id: paymentId },
        });

        if (!existingPayment) {
          // Crear nuevo pago
          const preferenceId = (paymentData as { preference_id?: string })
            .preference_id;
          const metadata =
            paymentData.metadata && typeof paymentData.metadata === 'object'
              ? (paymentData.metadata as {
                  user_id?: string;
                  appointment_id?: string;
                })
              : {};

          const userId = metadata.user_id;
          const appointmentId = metadata.appointment_id;

          const newPayment = this.paymentsRepository.create({
            amount: paymentData.transaction_amount || 0,
            currency: paymentData.currency_id || 'ARS',
            pay_method: PayMethod.MERCADO_PAGO,
            pay_status: PayStatus.COMPLETED,
            mercado_pago_id: paymentId,
            preference_id: preferenceId,
            payer_email: paymentData.payer?.email,
            user_id: userId,
            appointment_id: appointmentId, // ✅ Agregar appointment_id desde metadatos
            notes: 'Pago procesado via MercadoPago',
          });

          const savedPayment = await this.paymentsRepository.save(newPayment);

          // Actualizar estado del turno a pendiente de aprobación si existe appointment_id
          if (savedPayment.appointment_id) {
            await this.updateAppointmentStatusAfterPayment(
              savedPayment.appointment_id,
            );
          }
        } else {
          // Actualizar pago existente
          existingPayment.pay_status = PayStatus.COMPLETED;
          const savedPayment =
            await this.paymentsRepository.save(existingPayment);

          // Actualizar estado del turno a pendiente de aprobación si existe appointment_id
          if (savedPayment.appointment_id) {
            await this.updateAppointmentStatusAfterPayment(
              savedPayment.appointment_id,
            );
          }
        }
      }
    } catch (error) {
      console.error('Error procesando webhook de pago:', error);
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<Payment[]> {
    return this.paymentsRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
  }

  /**
   * Actualiza el estado del turno a PENDING_APPROVAL después de un pago exitoso
   */
  private async updateAppointmentStatusAfterPayment(
    appointmentId: string,
  ): Promise<void> {
    try {
      const appointment = await this.appointmentsRepository.findOne({
        where: { id: appointmentId },
      });

      if (
        appointment &&
        (appointment.status === AppointmentStatus.PENDING_PAYMENT ||
          appointment.status === AppointmentStatus.PENDING)
      ) {
        appointment.status = AppointmentStatus.PENDING_APPROVAL;
        await this.appointmentsRepository.save(appointment);
        console.log(
          `Appointment ${appointmentId} status updated to PENDING_APPROVAL after payment`,
        );
      }
    } catch (error) {
      console.error(
        'Error actualizando estado de cita después del pago:',
        error,
      );
      // No lanzamos error para no interrumpir el flujo de webhook
    }
  }

  findByProfessionalId(_professionalId: string): Promise<Payment[]> {
    // Por ahora retornamos una lista vacía hasta implementar la relación completa
    // En producción, esto requeriría configurar las relaciones entre Payment y Appointment
    return Promise.resolve([]);
  }
}
