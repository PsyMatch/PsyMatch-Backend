import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { RecordsService } from './records.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { Roles } from '../../modules/auth/decorators/role.decorator';
import { RolesGuard } from '../../modules/auth/guards/roles.guard';
import { ERole } from '../../common/enums/role.enum';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiParam,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { CombinedAuthGuard } from '../auth/guards/combined-auth.guard';

@Controller('records')
@ApiTags('Historiales Médicos')
@ApiBearerAuth('JWT-auth')
@ApiUnauthorizedResponse({
  description: 'No autorizado - Token JWT inválido o faltante',
})
@ApiForbiddenResponse({
  description: 'Prohibido - Permisos insuficientes para este rol',
})
@ApiInternalServerErrorResponse({
  description: 'Error interno del servidor',
})
@UseGuards(CombinedAuthGuard, RolesGuard)
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Crear un nuevo historial médico',
    description:
      'Crea una nueva entrada de historial médico. Solo los psicólogos pueden crear historiales para sus pacientes.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        patient_id: { type: 'string', example: 'patient-uuid' },
        title: { type: 'string', example: 'Notas de Sesión' },
        description: {
          type: 'string',
          example: 'Notas de progreso del paciente...',
        },
        session_type: { type: 'string', example: 'individual' },
        treatment_plan: {
          type: 'string',
          example: 'Continuar sesiones de TCC',
        },
        diagnosis: {
          type: 'string',
          example: 'Trastorno de Ansiedad Generalizada',
        },
        medications: { type: 'string', example: 'Sertralina 50mg diarios' },
        next_appointment: { type: 'string', example: '2024-03-22T10:00:00Z' },
        notes: { type: 'string', example: 'El paciente mostró mejoras' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Historial creado exitosamente',
    schema: {
      example: {
        success: true,
        statusCode: 201,
        message: 'Historial creado exitosamente',
        data: {
          id: 'uuid-record-id',
          title: 'Notas de Sesión',
          description: 'Notas de progreso del paciente...',
          createdAt: '2025-01-15T10:30:00Z',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Datos de entrada inválidos o errores de validación',
  })
  @Roles([ERole.PSYCHOLOGIST])
  create(@Body() dto: CreateRecordDto) {
    return this.recordsService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los historiales médicos',
    description:
      'Recupera todos los historiales médicos del sistema. Solo los administradores tienen acceso a todos los historiales.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de todos los historiales recuperada exitosamente',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        message: 'Historiales recuperados exitosamente',
        data: [
          {
            id: 'uuid-record-1',
            title: 'Evaluación Inicial',
            description: 'Notas de primera consulta...',
            createdAt: '2025-01-15T10:30:00Z',
          },
        ],
      },
    },
  })
  @Roles([ERole.ADMIN])
  findAll() {
    return this.recordsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener historial médico por ID',
    description:
      'Recupera un historial médico específico por su ID. El acceso depende del rol del usuario y la propiedad.',
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador único del historial médico',
    example: 'uuid-record-id',
  })
  @ApiResponse({
    status: 200,
    description: 'Historial recuperado exitosamente',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        message: 'Historial recuperado exitosamente',
        data: {
          id: 'uuid-record-id',
          title: 'Notas de Sesión',
          description: 'Notas detalladas de la sesión...',
          createdAt: '2025-01-15T10:30:00Z',
          updatedAt: '2025-01-15T10:30:00Z',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Historial no encontrado o acceso denegado',
  })
  @Roles([ERole.ADMIN, ERole.PSYCHOLOGIST, ERole.PATIENT])
  findOne(@Param('id') id: string) {
    return this.recordsService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: 'Obtener historiales médicos por ID de usuario',
    description:
      'Recupera todos los historiales médicos de un usuario/paciente específico. Accesible por administradores, psicólogos y el propio paciente.',
  })
  @ApiParam({
    name: 'userId',
    description: 'Identificador único del usuario/paciente',
    example: 'uuid-user-id',
  })
  @ApiResponse({
    status: 200,
    description: 'Historiales del usuario recuperados exitosamente',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        message: 'Historiales del usuario recuperados exitosamente',
        data: [
          {
            id: 'uuid-record-1',
            title: 'Sesión 1',
            description: 'Notas de primera sesión...',
            createdAt: '2025-01-15T10:30:00Z',
          },
          {
            id: 'uuid-record-2',
            title: 'Sesión 2',
            description: 'Notas de segunda sesión...',
            createdAt: '2025-01-22T10:30:00Z',
          },
        ],
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Usuario no encontrado o no hay historiales disponibles',
  })
  @Roles([ERole.ADMIN, ERole.PSYCHOLOGIST, ERole.PATIENT])
  findByUserId(@Param('userId') userId: string) {
    return this.recordsService.findByUserId(userId);
  }

  @Get('psychologist/:psychologistId')
  @ApiOperation({
    summary: 'Obtener historiales médicos por ID de psicólogo',
    description:
      'Recupera todos los historiales médicos creados por un psicólogo específico. Accesible por administradores y el propio psicólogo.',
  })
  @ApiParam({
    name: 'psychologistId',
    description: 'Identificador único del psicólogo',
    example: 'uuid-psychologist-id',
  })
  @ApiResponse({
    status: 200,
    description: 'Historiales del psicólogo recuperados exitosamente',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        message: 'Historiales del psicólogo recuperados exitosamente',
        data: [
          {
            id: 'uuid-record-1',
            title: 'Paciente A - Sesión 1',
            description: 'Notas de sesión para Paciente A...',
            createdAt: '2025-01-15T10:30:00Z',
          },
        ],
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Psicólogo no encontrado o no hay historiales disponibles',
  })
  @Roles([ERole.ADMIN, ERole.PSYCHOLOGIST])
  findByPsychologistId(@Param('psychologistId') psychologistId: string) {
    return this.recordsService.findByPsychologistId(psychologistId);
  }

  @Get('user/:userId/psychologist/:psychologistId')
  @ApiOperation({
    summary: 'Obtener historiales por relación usuario-psicólogo',
    description:
      'Recupera historiales médicos de una relación específica usuario-psicólogo. Muestra todos los historiales creados por el psicólogo para el paciente específico.',
  })
  @ApiParam({
    name: 'userId',
    description: 'Identificador único del usuario/paciente',
    example: 'uuid-user-id',
  })
  @ApiParam({
    name: 'psychologistId',
    description: 'Identificador único del psicólogo',
    example: 'uuid-psychologist-id',
  })
  @ApiResponse({
    status: 200,
    description: 'Historiales de la relación recuperados exitosamente',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        message: 'Historiales de la relación recuperados exitosamente',
        data: [
          {
            id: 'uuid-record-1',
            title: 'Evaluación Inicial',
            description: 'Primera consulta entre paciente y psicólogo...',
            createdAt: '2025-01-15T10:30:00Z',
          },
        ],
      },
    },
  })
  @ApiNotFoundResponse({
    description:
      'Usuario, psicólogo no encontrado o no hay historiales disponibles para esta relación',
  })
  @Roles([ERole.ADMIN, ERole.PSYCHOLOGIST])
  findByUserAndPsychologist(
    @Param('userId') userId: string,
    @Param('psychologistId') psychologistId: string,
  ) {
    return this.recordsService.findByUserAndPsychologist(
      userId,
      psychologistId,
    );
  }

  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Actualizar un historial médico',
    description:
      'Actualiza un historial médico existente. Solo los administradores y el psicólogo que creó el historial pueden actualizarlo.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Notas de Sesión Actualizadas' },
        description: {
          type: 'string',
          example: 'Progreso actualizado del paciente...',
        },
        session_type: { type: 'string', example: 'individual' },
        treatment_plan: { type: 'string', example: 'Enfoque TCC modificado' },
        diagnosis: { type: 'string', example: 'Diagnóstico actualizado' },
        medications: { type: 'string', example: 'Medicación ajustada' },
        next_appointment: { type: 'string', example: '2024-03-29T10:00:00Z' },
        notes: { type: 'string', example: 'Notas adicionales' },
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador único del historial médico a actualizar',
    example: 'uuid-record-id',
  })
  @ApiResponse({
    status: 200,
    description: 'Historial actualizado exitosamente',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        message: 'Historial actualizado exitosamente',
        data: {
          id: 'uuid-record-id',
          title: 'Notas de Sesión Actualizadas',
          description: 'Notas de sesión actualizadas...',
          updatedAt: '2025-01-15T11:00:00Z',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Datos de entrada inválidos o errores de validación',
  })
  @ApiNotFoundResponse({
    description: 'Historial no encontrado o acceso denegado',
  })
  @Roles([ERole.ADMIN, ERole.PSYCHOLOGIST])
  update(@Param('id') id: string, @Body() dto: UpdateRecordDto) {
    return this.recordsService.update(id, dto);
  }

  @Put(':id/soft-delete')
  @ApiOperation({
    summary: 'Eliminación suave de un historial médico',
    description:
      'Marca un historial médico como inactivo en lugar de eliminarlo permanentemente. Solo los administradores y el psicólogo que creó el historial pueden eliminarlo suavemente.',
  })
  @ApiParam({
    name: 'id',
    description:
      'Identificador único del historial médico a eliminar suavemente',
    example: 'uuid-record-id',
  })
  @ApiResponse({
    status: 200,
    description: 'Historial eliminado suavemente exitosamente',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        message: 'Historial eliminado suavemente exitosamente',
        data: {
          id: 'uuid-record-id',
          is_active: false,
          updated_at: '2025-01-15T12:00:00Z',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Historial no encontrado o acceso denegado',
  })
  @Roles([ERole.ADMIN, ERole.PSYCHOLOGIST])
  softDelete(@Param('id') id: string) {
    return this.recordsService.softDelete(id);
  }
}
