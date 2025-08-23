import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { VerificationPsychologistService } from './verificationPsychologist.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from '../../../../modules/auth/guards/roles.guard';
import {
  PaginatedResponse,
  PaginationDto,
} from '../../../../common/dto/pagination.dto';
import { ResponseProfessionalDto } from '../../dto/response-professional.dto';
import { CombinedAuthGuard } from '../../../auth/guards/combined-auth.guard';

@Controller('psychologist/verification')
@ApiTags('Profesionales')
@ApiBearerAuth('JWT-auth')
@UseGuards(CombinedAuthGuard, RolesGuard)
export class VerificationPsychologistController {
  constructor(
    private readonly verificationPsychologistService: VerificationPsychologistService,
  ) {}

  @Get('verified')
  @ApiOperation({
    summary: 'Obterner todos los profesionales verificados (SOLO ADMIN)',
    description: 'Obtener una lista paginada de psicólogos verificados',
  })
  @ApiResponse({
    status: 200,
    description: 'Psicólogos verificados recuperados exitosamente',
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
              verified: { type: 'string', example: 'verified' },
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
    description: 'No se encontraron solicitudes de psicólogos verificados',
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
  getAllVerifiedController(
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<ResponseProfessionalDto>> {
    return this.verificationPsychologistService.getAllVerifiedService(
      paginationDto,
    );
  }
}
