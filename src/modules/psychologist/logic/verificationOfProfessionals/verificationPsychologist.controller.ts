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
} from 'src/common/dto/pagination.dto';
import { User } from 'src/modules/users/entities/user.entity';

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
    summary: '[Verification] Get all pending verification requests',
    description: 'Get a paginated list of psychologists pending verification',
  })
  @ApiResponse({
    status: 200,
    description: 'Pending psychologists retrieved successfully',
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
    description: 'Access denied - Admin role required',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired token',
  })
  @ApiResponse({
    status: 404,
    description: 'No pending psychologist requests found',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 5)',
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
    summary: 'Verify a psychologist by ID (Admin Only)',
    description:
      'Approve or reject a psychologist registration request. Changes the verification status from pending to validated or rejected.',
  })
  @ApiResponse({
    status: 200,
    description: 'Psychologist verification status updated successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Psychologist verified successfully',
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
    description: 'Access denied - Admin role required',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired token',
  })
  @ApiResponse({
    status: 404,
    description: 'Psychologist not found',
  })
  verifyAPsychologistById(@Param('id') id: string) {
    return this.verificationPsychologistService.findOne(id);
  }

  @Put(':id/reject')
  @Roles([ERole.ADMIN])
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Reject a psychologist by ID (Admin Only)',
    description:
      'Reject a psychologist registration request. Changes the verification status from pending to rejected.',
  })
  @ApiResponse({
    status: 200,
    description: 'Psychologist verification status updated successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Psychologist rejected successfully',
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
    description: 'Access denied - Admin role required',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired token',
  })
  @ApiResponse({
    status: 404,
    description: 'Psychologist not found',
  })
  rejectAPsychologistById(@Param('id') id: string) {
    return this.verificationPsychologistService.rejectPsychologistById(id);
  }
}
