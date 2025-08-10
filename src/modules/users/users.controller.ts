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
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SameUserOrAdminGuard } from '../auth/guards/same-user.guard';
import { IAuthRequest } from '../auth/interfaces/auth-request.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { ERole } from '../../common/enums/role.enum';
import { Roles } from '../auth/decorators/role.decorator';
import { ResponseType } from '../../common/decorators/response-type.decorator';
import { ResponseUserDto } from './dto/response-user.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([ERole.ADMIN])
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get all users (Admin Only)',
  })
  @ApiResponse({
    status: 200,
    description: 'Users list retrieved successfully',
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
              social_security_number: {
                type: 'string',
                example: '123-45-6789',
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
    description: 'Users list retrieved successfully',
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
              social_security_number: {
                type: 'string',
                example: '123-45-6789',
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
    description: 'User found successfully',
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
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        profile_picture: {
          type: 'string',
          example: 'https://example.com/new-profile.jpg',
          nullable: true,
        },
        phone: { type: 'string', example: '+5411987654321', nullable: true },
        birthdate: {
          type: 'string',
          format: 'date',
          example: '2025-07-31',
          nullable: true,
        },
        address: {
          type: 'string',
          example: 'Av. Santa Fe 2000, Buenos Aires',
          nullable: true,
        },
        latitude: { type: 'number', example: -34.5975, nullable: true },
        longitude: { type: 'number', example: -58.3816, nullable: true },
        password: {
          type: 'string',
          example: 'NewSecurePass123!',
          nullable: true,
        },
        psychologists: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', example: 'Dr. Ana García' },
              email: { type: 'string', example: 'ana.garcia@psychologist.com' },
              role: { type: 'string', example: 'psychologist' },
            },
          },
          nullable: true,
          description:
            'Assigned psychologists for this patient (only applicable when user role is PATIENT)',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User updated successfully' },
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
  ): Promise<{ message: string; id: string }> {
    const updatedUser = await this.usersService.update(
      id,
      userData,
      req.user.id,
      req.user.role,
    );
    return { message: 'User updated successfully', id: updatedUser };
  }

  @Delete(':id')
  @UseGuards(AuthGuard, SameUserOrAdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User deleted successfully' },
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
    return { message: 'User deleted successfully', id: userId };
  }
}
