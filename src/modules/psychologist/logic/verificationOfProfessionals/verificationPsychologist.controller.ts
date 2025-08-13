import { Controller, Get, Param, Put, Query, UseGuards } from '@nestjs/common';
import { VerificationPsychologistService } from './verificationPsychologist.service';
import { Roles } from '../../../../modules/auth/decorators/role.decorator';
import { ERole } from '../../../../common/enums/role.enum';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../../../../modules/auth/guards/auth.guard';
import { RolesGuard } from '../../../../modules/auth/guards/roles.guard';
import {
  PaginatedResponse,
  PaginationDto,
} from '../../../../common/dto/pagination.dto';
import { User } from '../../../users/entities/user.entity';

@Controller('psychologist/verification')
@ApiTags('Psychologist')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard, RolesGuard)
export class VerificationPsychologistController {
  constructor(
    private readonly verificationPsychologistService: VerificationPsychologistService,
  ) {}

  @Get()
  @Roles([ERole.ADMIN])
  @ApiOperation({
    summary:
      '[Verificacion] Obtener todas las solicitudes de verificación pendientes (SOLO ADMIN)',
    description:
      'Obtener una lista paginada de psicólogos pendientes de verificación',
  })
  @ApiResponse({
    status: 200,
    description: 'Psicólogos pendientes recuperados exitosamente',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'psychologist-uuid' },
              name: { type: 'string', example: 'Dr. Ana García' },
              email: {
                type: 'string',
                example: 'ana.garcia@psychologist.com',
              },
              license_number: { type: 'string', example: 'PSI-12345' },
              office_address: {
                type: 'string',
                example: 'Consultorio en Av. Callao 1000, Piso 5',
              },
              specialities: {
                type: 'array',
                items: { type: 'string' },
                example: ['CLINICAL', 'COUNSELING'],
              },
              verified: { type: 'string', example: 'pending' },
            },
          },
        },
        total: { type: 'number', example: 25 },
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 10 },
        totalPages: { type: 'number', example: 3 },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - Se requiere rol de administrador',
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido o expirado',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontraron solicitudes de psicólogos pendientes',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página (por defecto: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Elementos por página (por defecto: 5)',
    example: 10,
  })
  getAllVerifiedRequestController(
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<User>> {
    return this.verificationPsychologistService.getAllVerifiedRequestService(
      paginationDto,
    );
  }

  @Put(':id/verify')
  @Roles([ERole.ADMIN])
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Verificar un psicólogo por ID (Solo administradores)',
    description:
      'Aprobar o rechazar una solicitud de registro de psicólogo. Cambia el estado de verificación de pendiente a validado o rechazado.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Estado de verificación del psicólogo actualizado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Psicólogo verificado exitosamente',
        },
        psychologist: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'psychologist-uuid' },
            name: { type: 'string', example: 'Dr. Ana García' },
            verified: { type: 'string', example: 'VALIDATED' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - Se requiere rol de administrador',
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido o expirado',
  })
  @ApiResponse({
    status: 404,
    description: 'Psicólogo no encontrado',
  })
  verifyAPsychologistById(@Param('id') id: string) {
    return this.verificationPsychologistService.findOne(id);
  }

  @Put(':id/reject')
  @Roles([ERole.ADMIN])
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Rechazar un psicólogo por ID (Solo administradores)',
    description:
      'Rechazar una solicitud de registro de psicólogo. Cambia el estado de verificación de pendiente a rechazado.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Estado de verificación del psicólogo actualizado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Psicólogo rechazado exitosamente',
        },
        psychologist: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'psychologist-uuid' },
            name: { type: 'string', example: 'Dr. Ana García' },
            verified: { type: 'string', example: 'REJECTED' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - Se requiere rol de administrador',
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido o expirado',
  })
  @ApiResponse({
    status: 404,
    description: 'Psicólogo no encontrado',
  })
  rejectAPsychologistById(@Param('id') id: string) {
    return this.verificationPsychologistService.rejectPsychologistById(id);
  }
}
