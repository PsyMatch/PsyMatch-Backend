import { Controller, Get, Param, Put, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  PaginatedResponse,
  PaginationDto,
} from '../../../../common/dto/pagination.dto';
import { ERole } from '../../../../common/enums/role.enum';
import { Roles } from '../../../auth/decorators/role.decorator';
import { CombinedAuthGuard } from '../../../auth/guards/combined-auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { ResponseProfessionalDto } from '../../../psychologist/dto/response-professional.dto';
import { AdminService } from './admin.service';
import { ResponseUserDto } from '../../../users/dto/response-user.dto';

@Controller('admin')
@ApiTags('Administrador')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  @UseGuards(CombinedAuthGuard, RolesGuard)
  @Roles([ERole.ADMIN])
  @ApiBearerAuth('JWT-auth')
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
  ): Promise<PaginatedResponse<ResponseProfessionalDto>> {
    return this.adminService.getAllVerifiedRequestService(paginationDto);
  }

  @Put(':id/verify')
  @UseGuards(CombinedAuthGuard, RolesGuard)
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
  verifyAPsychologistById(
    @Param('id') id: string,
  ): Promise<{ message: string; data: ResponseProfessionalDto }> {
    return this.adminService.findOne(id);
  }

  @Put(':id/reject')
  @UseGuards(CombinedAuthGuard, RolesGuard)
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
  rejectAPsychologistById(
    @Param('id') id: string,
  ): Promise<{ message: string; data: ResponseProfessionalDto }> {
    return this.adminService.rejectPsychologistById(id);
  }

  @Put(':id/promote')
  @UseGuards(CombinedAuthGuard, RolesGuard)
  @Roles([ERole.ADMIN])
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Promover un usuario a un rol superior (Solo administradores)',
    description:
      'Promover un usuario a un rol superior. Cambia el rol del usuario a un rol de mayor nivel.',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario promovido exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Usuario promovido exitosamente',
        },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'user-uuid' },
            name: { type: 'string', example: 'Dr. Ana García' },
            role: { type: 'string', example: 'SENIOR_PSYCHOLOGIST' },
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
  promoteAUserById(@Param('id') id: string): Promise<{
    message: string;
    data: ResponseUserDto;
  }> {
    return this.adminService.promoteUserById(id);
  }

  @Put(':id/ban')
  @UseGuards(CombinedAuthGuard, RolesGuard)
  @Roles([ERole.ADMIN])
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Banear un usuario por ID (Solo administradores)',
    description:
      'Banear un usuario del sistema. Desactiva la cuenta del usuario estableciendo is_active a false.',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario baneado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Usuario baneado exitosamente',
        },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'user-uuid' },
            name: { type: 'string', example: 'Juan Pérez' },
            email: { type: 'string', example: 'juan.perez@email.com' },
            is_active: { type: 'boolean', example: false },
            role: { type: 'string', example: 'USER' },
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
    description: 'Usuario no encontrado',
  })
  banUserById(@Param('id') id: string): Promise<{
    message: string;
    data: ResponseUserDto;
  }> {
    return this.adminService.banUserById(id);
  }

  @Get('banned-users')
  @UseGuards(CombinedAuthGuard, RolesGuard)
  @Roles([ERole.ADMIN])
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Obtener todos los usuarios baneados (Solo administradores)',
    description:
      'Obtener una lista paginada de todos los usuarios que han sido baneados (is_active = false)',
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
    description: 'Número de elementos por página (por defecto: 10)',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Usuarios baneados recuperados exitosamente',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'user-uuid' },
              name: { type: 'string', example: 'Juan Pérez' },
              email: { type: 'string', example: 'juan@example.com' },
              role: { type: 'string', example: 'Paciente' },
              is_active: { type: 'boolean', example: false },
              created_at: { type: 'string', example: '2023-12-01T10:00:00Z' },
            },
          },
        },
        meta: {
          type: 'object',
          properties: {
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
            total: { type: 'number', example: 25 },
            totalPages: { type: 'number', example: 3 },
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
  getBannedUsers(
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<ResponseUserDto>> {
    return this.adminService.getBannedUsersService(paginationDto);
  }

  @Put(':id/unban')
  @UseGuards(CombinedAuthGuard, RolesGuard)
  @Roles([ERole.ADMIN])
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Desbanear un usuario por ID (Solo administradores)',
    description:
      'Desbanear un usuario del sistema. Reactiva la cuenta del usuario estableciendo is_active a true.',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario desbaneado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Usuario desbaneado exitosamente',
        },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'user-uuid' },
            name: { type: 'string', example: 'Juan Pérez' },
            email: { type: 'string', example: 'juan.perez@email.com' },
            is_active: { type: 'boolean', example: true },
            role: { type: 'string', example: 'USER' },
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
    description: 'Usuario no encontrado',
  })
  unbanUserById(@Param('id') id: string): Promise<{
    message: string;
    data: ResponseUserDto;
  }> {
    return this.adminService.unbanUserById(id);
  }
}
