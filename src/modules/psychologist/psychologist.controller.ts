import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PsychologistService } from './psychologist.service';
import { UpdatePsychologistDto } from './dto/update-psychologist.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { ERole } from '../../common/enums/role.enum';
import { PaginatedPendingRequestsDto } from './dto/response-pending-psychologist.dto';

@ApiTags('Psicólogos')
@Controller('psychologist')
export class PsychologistController {
  constructor(private readonly psychologistService: PsychologistService) {}

  @Get('pending')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([ERole.ADMIN])
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Obtener todos los psicólogos pendientes (Solo administradores)',
    description:
      'Recuperar una lista paginada de psicólogos esperando verificación. Solo accesible por administradores.',
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
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<PaginatedPendingRequestsDto> {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 5;
    return this.psychologistService.getAllVerifiedRequestService(
      pageNumber,
      limitNumber,
    );
  }

  @Put(':id/verify')
  @UseGuards(AuthGuard, RolesGuard)
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
    return this.psychologistService.findOne(id);
  }

  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Actualizar información del psicólogo',
    description: 'Actualizar información del perfil del psicólogo.',
  })
  @ApiBody({
    description: 'Datos de actualización del psicólogo (form-data)',
    schema: {
      type: 'object',
      properties: {
        license_number: {
          type: 'string',
          description: 'Número de matrícula profesional',
          example: 'PSY-123456',
        },
        specialities: {
          type: 'string',
          description: 'Especialidades separadas por comas',
          example: 'ansiedad,depresión,trauma',
        },
        experience_years: {
          type: 'string',
          description: 'Años de experiencia',
          example: '5',
        },
        modality: {
          type: 'string',
          description: 'Modalidad de terapia',
          enum: ['PRESENTIAL', 'VIRTUAL', 'MIXED'],
          example: 'VIRTUAL',
        },
        rate_per_session: {
          type: 'string',
          description: 'Tarifa por sesión en USD',
          example: '80.00',
        },
        bio: {
          type: 'string',
          description: 'Biografía profesional',
          example:
            'Psicólogo clínico licenciado con más de 5 años de experiencia...',
        },
        availability: {
          type: 'string',
          description: 'Horarios disponibles (formato JSON)',
          example: '{"monday": ["09:00-12:00", "14:00-18:00"]}',
        },
      },
    },
  })
  update(
    @Param('id') id: string,
    @Body() updatePsychologistDto: UpdatePsychologistDto,
  ) {
    return this.psychologistService.update(id, updatePsychologistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.psychologistService.remove(id);
  }
}
