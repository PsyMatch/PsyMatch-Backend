import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SameUserOrAdminGuard } from '../auth/guards/same-user.guard';
import { IAuthRequest } from '../auth/interfaces/auth-request.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileValidationPipe } from '../files/pipes/file-validation.pipe';
import { ERole } from '../../common/enums/role.enum';
import { Roles } from '../auth/decorators/role.decorator';
import { ResponseType } from '../../common/decorators/response-type.decorator';
import { ResponseUserDto } from './dto/response-user.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { Payment } from '../payments/entities/payment.entity';

@ApiTags('Usuarios')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([ERole.ADMIN])
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Obtener todos los usuarios (Solo administradores)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios recuperada exitosamente',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'uuid-string' },
              name: { type: 'string', example: 'Juan Carlos Pérez' },
              profile_picture: {
                type: 'string',
                example: 'https://cloudinary.com/profile.jpg',
                nullable: true,
              },
              phone: {
                type: 'string',
                example: '+5411123456789',
                nullable: true,
              },
              birthdate: {
                type: 'string',
                format: 'date',
                example: '2025-07-31',
                nullable: true,
              },
              dni: { type: 'number', example: 12345678 },
              health_insurance: {
                type: 'string',
                example: 'OSDE',
                description: 'Health insurance provider',
                enum: [
                  'OSDE',
                  'Swiss Medical',
                  'IOMA',
                  'PAMI',
                  'Unión Personal',
                  'OSDEPYM',
                  'Luis Pasteur',
                  'Jerárquicos Salud',
                  'Sancor Salud',
                  'OSECAC',
                  'OSMECON Salud',
                  'Apross',
                  'OSPRERA',
                  'OSPAT',
                  'ASE Nacional',
                  'OSPIP',
                ],
                nullable: true,
              },
              address: {
                type: 'string',
                example: 'Av. Corrientes 1234, Buenos Aires',
                nullable: true,
              },
              email: {
                type: 'string',
                example: 'juan.perez@email.com',
                description: 'User email address',
              },
              latitude: {
                type: 'number',
                example: -34.5975,
                description: 'User latitude coordinate',
                nullable: true,
              },
              longitude: {
                type: 'number',
                example: -58.3816,
                description: 'User longitude coordinate',
                nullable: true,
              },
              role: {
                type: 'string',
                example: 'Paciente',
                description: 'User role',
                enum: ['Paciente', 'Psicólogo', 'Administrador'],
              },
              emergency_contact: {
                type: 'string',
                example: 'Juan Perez - +5411111111 - Hermano',
                nullable: true,
              },
              // Psychologist-specific fields (only populated when user is a psychologist)
              personal_biography: {
                type: 'string',
                example:
                  'Psicólogo especializado en terapia cognitivo-conductual...',
                nullable: true,
              },
              languages: {
                type: 'array',
                items: {
                  type: 'string',
                  enum: ['Inglés', 'Español', 'Portugués'],
                },
                example: ['Español', 'Inglés'],
                nullable: true,
              },
              professional_title: {
                type: 'string',
                example: 'Licenciado en Psicología',
                nullable: true,
              },
              professional_experience: {
                type: 'number',
                example: 5,
                description: 'Years of professional experience',
                nullable: true,
              },
              license_number: {
                type: 'number',
                example: 12345678,
                description: 'Professional license number',
                nullable: true,
              },
              verified: {
                type: 'string',
                example: 'Validado',
                enum: ['Pendiente', 'Validado', 'Rechazado'],
                nullable: true,
              },
              office_address: {
                type: 'string',
                example: 'Av. Corrientes 1500, Buenos Aires',
                nullable: true,
              },
              specialities: {
                type: 'array',
                items: {
                  type: 'string',
                  enum: [
                    'Trastorno de ansiedad',
                    'Terapia de pareja',
                    'Trastorno de la alimentación',
                    'Trastorno bipolar',
                    'Transiciones de vida',
                    'Terapia infantil y adolescente',
                    'Trastornos del sueño',
                    'Depresión',
                    'Terapia familiar',
                    'TDAH',
                    'TOC',
                    'Orientación profesional',
                    'Psicología geriátrica',
                    'Manejo de la ira',
                    'Trauma y TEPT',
                    'Adicción y abuso de sustancias',
                    'Trastorno del espectro autista',
                    'Duelo y pérdida',
                    'LGBTQIA',
                    'Manejo del dolor crónico',
                  ],
                },
                example: ['Trastorno de ansiedad', 'Depresión'],
                nullable: true,
              },
              therapy_approaches: {
                type: 'array',
                items: {
                  type: 'string',
                  enum: [
                    'Terapia cognitivo-conductual',
                    'Terapia de aceptación y compromiso',
                    'Terapia psicodinámica',
                    'Terapia de sistemas familiares',
                    'Terapia breve centrada en soluciones',
                    'Terapia de juego',
                    'Terapia dialéctico-conductual',
                    'Desensibilización y reprocesamiento por movimientos oculares',
                    'Terapia centrada en la persona',
                    'Terapia basada en la atención plena',
                    'Terapia Gestalt',
                    'Terapia de arte',
                    'Terapia de grupo',
                  ],
                },
                example: ['Terapia cognitivo-conductual'],
                nullable: true,
              },
              session_types: {
                type: 'array',
                items: {
                  type: 'string',
                  enum: ['Individual', 'Pareja', 'Familiar', 'Grupo'],
                },
                example: ['Individual', 'Pareja'],
                nullable: true,
              },
              modality: {
                type: 'string',
                example: 'Híbrido',
                enum: ['Presencial', 'En línea', 'Híbrido'],
                nullable: true,
              },
              insurance_accepted: {
                type: 'array',
                items: {
                  type: 'string',
                  enum: [
                    'OSDE',
                    'Swiss Medical',
                    'IOMA',
                    'PAMI',
                    'Unión Personal',
                    'OSDEPYM',
                    'Luis Pasteur',
                    'Jerárquicos Salud',
                    'Sancor Salud',
                    'OSECAC',
                    'OSMECON Salud',
                    'Apross',
                    'OSPRERA',
                    'OSPAT',
                    'ASE Nacional',
                    'OSPIP',
                  ],
                },
                example: ['OSDE', 'Swiss Medical'],
                nullable: true,
              },
              availability: {
                type: 'array',
                items: {
                  type: 'string',
                  enum: [
                    'Lunes',
                    'Martes',
                    'Miércoles',
                    'Jueves',
                    'Viernes',
                    'Sábado',
                    'Domingo',
                  ],
                },
                example: ['Lunes', 'Martes', 'Miércoles'],
                nullable: true,
              },
              psychologists: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string', example: 'Dr. Ana García' },
                    email: {
                      type: 'string',
                      example: 'ana.garcia@psychologist.com',
                    },
                    role: { type: 'string', example: 'Psicólogo' },
                  },
                },
                nullable: true,
                description:
                  'Assigned psychologists (only populated when user role is PATIENT)',
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid or expired token' })
  @ApiResponse({
    status: 403,
    description: 'Access denied - Admin role required',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(@Query() paginationDto: PaginationDto) {
    return await this.usersService.findAll(paginationDto);
  }

  @Get('patients')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([ERole.ADMIN])
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get all patients (Admin Only)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'uuid-string' },
              name: { type: 'string', example: 'Juan Carlos Pérez' },
              profile_picture: {
                type: 'string',
                example: 'https://cloudinary.com/profile.jpg',
                nullable: true,
              },
              phone: {
                type: 'string',
                example: '+5411123456789',
                nullable: true,
              },
              birthdate: {
                type: 'string',
                format: 'date',
                example: '2025-07-31',
                nullable: true,
              },
              dni: { type: 'number', example: 12345678 },
              health_insurance: {
                type: 'string',
                example: 'OSDE',
                description: 'Health insurance provider',
                enum: [
                  'OSDE',
                  'Swiss Medical',
                  'IOMA',
                  'PAMI',
                  'Unión Personal',
                  'OSDEPYM',
                  'Luis Pasteur',
                  'Jerárquicos Salud',
                  'Sancor Salud',
                  'OSECAC',
                  'OSMECON Salud',
                  'Apross',
                  'OSPRERA',
                  'OSPAT',
                  'ASE Nacional',
                  'OSPIP',
                ],
                nullable: true,
              },
              address: {
                type: 'string',
                example: 'Av. Corrientes 1234, Buenos Aires',
                nullable: true,
              },
              email: {
                type: 'string',
                example: 'juan.perez@email.com',
                description: 'User email address',
              },
              latitude: {
                type: 'number',
                example: -34.5975,
                description: 'User latitude coordinate',
                nullable: true,
              },
              longitude: {
                type: 'number',
                example: -58.3816,
                description: 'User longitude coordinate',
                nullable: true,
              },
              role: {
                type: 'string',
                example: 'Paciente',
                description: 'User role',
                enum: ['Paciente', 'Psicólogo', 'Administrador'],
              },
              emergency_contact: {
                type: 'string',
                example: 'Juan Perez - +5411111111 - Hermano',
                nullable: true,
              },
              psychologists: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string', example: 'Dr. Ana García' },
                    email: {
                      type: 'string',
                      example: 'ana.garcia@psychologist.com',
                    },
                    role: { type: 'string', example: 'Psicólogo' },
                  },
                },
                nullable: true,
                description:
                  'Assigned psychologists (only populated when user role is PATIENT)',
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid or expired token' })
  @ApiResponse({
    status: 403,
    description: 'Access denied - Admin role required',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAllPatients(@Query() paginationDto: PaginationDto) {
    return await this.usersService.findAllPatients(paginationDto);
  }

  @Get(':id')
  @ResponseType(ResponseUserDto)
  @UseGuards(AuthGuard, SameUserOrAdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: 200,
    description: 'Usuario encontrado exitosamente',
    type: ResponseUserDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid or expired token' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ data: ResponseUserDto }> {
    const user = await this.usersService.findById(id);
    return { data: user as ResponseUserDto };
  }

  @Put(':id')
  @UseGuards(AuthGuard, SameUserOrAdminGuard)
  @UseInterceptors(FileInterceptor('profile_picture'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Juan Carlos Pérez Actualizado' },
        phone: { type: 'string', example: '+5411987654321' },
        birthdate: { type: 'string', example: '1990-05-15' },
        address: { type: 'string', example: 'Av. Santa Fe 2000, Buenos Aires' },
        latitude: { type: 'string', example: '-34.5975' },
        longitude: { type: 'string', example: '-58.3816' },
        password: { type: 'string', example: 'NewPassword123!' },
        health_insurance: {
          type: 'string',
          example: 'OSDE',
          description: 'Health insurance provider',
          enum: [
            'OSDE',
            'Swiss Medical',
            'IOMA',
            'PAMI',
            'Unión Personal',
            'OSDEPYM',
            'Luis Pasteur',
            'Jerárquicos Salud',
            'Sancor Salud',
            'OSECAC',
            'OSMECON Salud',
            'Apross',
            'OSPRERA',
            'OSPAT',
            'ASE Nacional',
            'OSPIP',
          ],
        },
        emergency_contact: {
          type: 'string',
          example: 'Juan Perez - +5411111111 - Hermano',
        },
        profile_picture: {
          type: 'string',
          format: 'binary',
          description:
            'Archivo opcional de foto de perfil (JPG, JPEG, PNG, WEBP - máx 2MB)',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Usuario actualizado exitosamente',
        },
        id: { type: 'string', example: 'uuid-string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid or expired token' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Req() req: IAuthRequest,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() userData: UpdateUserDto,
    @UploadedFile(new FileValidationPipe({ isOptional: true }))
    _profilePicture?: Express.Multer.File,
  ): Promise<{ message: string; id: string }> {
    const updatedUser = await this.usersService.update(
      id,
      userData,
      req.user.id,
      req.user.role,
    );
    return { message: 'Usuario actualizado exitosamente', id: updatedUser };
  }

  @Delete(':id')
  @UseGuards(AuthGuard, SameUserOrAdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiResponse({
    status: 200,
    description: 'Usuario eliminado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Usuario eliminado exitosamente' },
        id: { type: 'string', example: 'uuid-string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid or expired token' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async delete(
    @Req() req: IAuthRequest,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string; id: string }> {
    const userId = await this.usersService.delete(
      id,
      req.user.id,
      req.user.role,
    );
    return { message: 'Usuario eliminado exitosamente', id: userId };
  }

  //CODIGO DE PEDRO A PEDIDO DE MAURI

  @Get('patient/professionals')
  @Roles([ERole.PSYCHOLOGIST])
  @ApiOperation({
    summary: 'Obtener pacientes asignados al psicólogo logueado',
  })
  @ApiResponse({
    status: 200,
    description: 'Devuelve la lista de pacientes asignados al psicólogo',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token inválido o faltante',
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido - No es un psicólogo',
  })
  async getPatients(
    @Req() req: IAuthRequest,
  ): Promise<{ message: string; data: ResponseUserDto[] }> {
    const userId = req.user.id;
    return await this.usersService.getPsychologistsForPatient(userId);
  }

  @Get()
  @Roles([ERole.PSYCHOLOGIST])
  @ApiOperation({ summary: 'Obtener los pagos del usuario logueado' })
  @ApiResponse({ status: 200, description: 'Pagos recuperados exitosamente' })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token inválido o faltante',
  })
  @ApiResponse({ status: 403, description: 'Prohibido - No es un psicólogo' })
  @ApiResponse({ status: 404, description: 'No se encontraron pagos' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async getPayments(
    @Req() request: IAuthRequest,
  ): Promise<{ message: string; data: Payment[] }> {
    const userId = request.user.id;
    return await this.usersService.getPaymentsOfPatient(userId);
  }
}
