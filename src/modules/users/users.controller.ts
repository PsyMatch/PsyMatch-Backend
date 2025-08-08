import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { IAuthRequest } from '../auth/interfaces/auth-request.interface';
import { ResponseUserDto } from './dto/response-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ERole } from './enums/role.enum';
import { Roles } from '../auth/decorators/role.decorator';
import { ResponseType } from '../../common/decorators/response-type.decorator';
import { ImageValidationPipe } from '../files/pipes/image-validation.pipe';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ResponseType(ResponseUserDto)
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
                example: '15-05-1990',
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
              email: { type: 'string', example: 'juan.perez@email.com' },
              professionals: {
                type: 'array',
                items: { type: 'object' },
                nullable: true,
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
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<{ data: ResponseUserDto[] }> {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 5;
    const usersPaginated = await this.usersService.findAll(
      pageNumber,
      limitNumber,
    );
    return { data: usersPaginated };
  }

  @Get(':id')
  @ResponseType(ResponseUserDto)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User found successfully',
    schema: {
      type: 'object',
      properties: {
        data: {
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
              example: '15-05-1990',
              nullable: true,
            },
            dni: { type: 'number', example: 12345678 },
            social_security_number: { type: 'string', example: '123-45-6789' },
            address: {
              type: 'string',
              example: 'Av. Corrientes 1234, Buenos Aires',
              nullable: true,
            },
            email: { type: 'string', example: 'juan.perez@email.com' },
            professionals: {
              type: 'array',
              items: { type: 'object' },
              nullable: true,
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid or expired token' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ data: ResponseUserDto }> {
    const user = await this.usersService.findById(id);
    return { data: user };
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
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
        birthdate: { type: 'string', example: '20-12-1985', nullable: true },
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
        professionals: {
          type: 'array',
          items: { type: 'object' },
          nullable: true,
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

  @Post(':id/profile-picture')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update user profile picture',
    description: 'Upload and update user profile picture using Cloudinary',
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    description: 'Profile picture updated successfully',
    schema: {
      example: {
        message: 'Profile picture updated successfully',
        data: {
          id: 'user-uuid',
          profile_picture: 'https://cloudinary.com/optimized-image-url',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid or expired token' })
  @ApiResponse({
    status: 403,
    description: "Access denied - Cannot change another user's profile image",
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Invalid or missing file' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description:
            'Profile picture file (JPG, JPEG, PNG, WEBP - max 500KB)',
        },
      },
    },
  })
  async updateProfilePicture(
    @Req() req: IAuthRequest,
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile(new ImageValidationPipe()) file: Express.Multer.File,
  ): Promise<{
    message: string;
    data: { id: string; profile_picture: string };
  }> {
    const result = await this.usersService.updateProfilePicture(
      id,
      file,
      req.user.id,
      req.user.role,
    );
    return {
      message: 'Profile picture updated successfully',
      data: {
        id: result.id,
        profile_picture: result.profile_picture,
      },
    };
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
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
