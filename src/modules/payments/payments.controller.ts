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
  @ApiOperation({
    summary: 'Create a new payment',
    description:
      'Process a new payment for psychological services. Patients can create payments for their appointments.',
  })
  @ApiBody({ type: CreatePaymentDto })
  @ApiResponse({
    status: 201,
    description: 'Payment processed successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid payment data or payment processing failed',
  })
  create(@Body() dto: CreatePaymentDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles([ERole.ADMIN])
  @ApiOperation({
    summary: 'Get all payments (admin only)',
    description:
      'Retrieve all payments in the system. Only accessible by administrators.',
  })
  @ApiResponse({
    status: 200,
    description: 'Payments retrieved successfully',
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
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @Roles([ERole.ADMIN])
  @ApiOperation({ summary: 'Update payment (admin only)' })
  @ApiParam({ name: 'id', description: 'Payment UUID' })
  @ApiBody({ type: UpdatePaymentDto })
  update(@Param('id') id: string, @Body() dto: UpdatePaymentDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles([ERole.ADMIN])
  @ApiOperation({ summary: 'Delete payment (admin only)' })
  @ApiParam({ name: 'id', description: 'Payment UUID' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
