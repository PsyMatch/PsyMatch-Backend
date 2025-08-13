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
                example: 'osde',
                description: 'Health insurance provider',
                enum: [
                  'osde',
                  'swiss-medical',
                  'ioma',
                  'pami',
                  'unión-personal',
                  'osdepy',
                  'luis-pasteur',
                  'jerarquicos-salud',
                  'sancor-salud',
                  'osecac',
                  'osmecón-salud',
                  'apross',
                  'osprera',
                  'ospat',
                  'ase-nacional',
                  'ospsip',
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
                    role: { type: 'string', example: 'psychologist' },
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
                example: 'osde',
                description: 'Health insurance provider',
                enum: [
                  'osde',
                  'swiss-medical',
                  'ioma',
                  'pami',
                  'unión-personal',
                  'osdepy',
                  'luis-pasteur',
                  'jerarquicos-salud',
                  'sancor-salud',
                  'osecac',
                  'osmecón-salud',
                  'apross',
                  'osprera',
                  'ospat',
                  'ase-nacional',
                  'ospsip',
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
                    role: { type: 'string', example: 'psychologist' },
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
        phone: { type: 'string', example: '+5411987654321' },
        birthdate: { type: 'string', example: '1990-05-15' },
        address: { type: 'string', example: 'Av. Santa Fe 2000, Buenos Aires' },
        latitude: { type: 'string', example: '-34.5975' },
        longitude: { type: 'string', example: '-58.3816' },
        password: { type: 'string', example: 'NewPassword123!' },
        health_insurance: {
          type: 'string',
          example: 'osde',
          description: 'Health insurance provider',
          enum: [
            'osde',
            'swiss-medical',
            'ioma',
            'pami',
            'unión-personal',
            'osdepy',
            'luis-pasteur',
            'jerarquicos-salud',
            'sancor-salud',
            'osecac',
            'osmecón-salud',
            'apross',
            'osprera',
            'ospat',
            'ase-nacional',
            'ospsip',
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
}
