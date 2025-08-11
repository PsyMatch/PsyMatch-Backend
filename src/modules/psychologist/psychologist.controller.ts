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
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { ERole } from '../../common/enums/role.enum';
import { PaginatedPendingRequestsDto } from './dto/response-pending-psychologist.dto';

@ApiTags('Psychologist')
@Controller('psychologist')
export class PsychologistController {
  constructor(private readonly psychologistService: PsychologistService) {}

  @Get('pending')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([ERole.ADMIN])
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get all pending psychologists (Admin Only)',
    description:
      'Retrieve a paginated list of psychologists waiting for verification. Only accessible by administrators.',
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
              verified: { type: 'string', example: 'PENDING' },
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
    summary: 'Verify a psychologist by ID (Admin Only)',
    description:
      'Approve or reject a psychologist registration request. Changes the verification status from PENDING to VALIDATED or REJECTED.',
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
    return this.psychologistService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatePsychologistDto: UpdatePsychologistDto,
  ) {
    return this.psychologistService.update(+id, updatePsychologistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.psychologistService.remove(+id);
  }
}
