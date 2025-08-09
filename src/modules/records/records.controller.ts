import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Put,
  UseGuards,
} from '@nestjs/common';
import { RecordsService } from './records.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { Roles } from '../../modules/auth/decorators/role.decorator';
import { RolesGuard } from '../../modules/auth/guards/roles.guard';
import { AuthGuard } from '../../modules/auth/guards/auth.guard';
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
} from '@nestjs/swagger';

@Controller('records')
@ApiTags('Records')
@ApiBearerAuth('JWT-auth')
@ApiUnauthorizedResponse({
  description: 'Unauthorized - Invalid or missing JWT token',
})
@ApiForbiddenResponse({
  description: 'Forbidden - Insufficient permissions for this role',
})
@ApiInternalServerErrorResponse({
  description: 'Internal server error',
})
@UseGuards(AuthGuard, RolesGuard)
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new medical record',
    description:
      'Creates a new medical record entry. Only psychologists can create records for their patients.',
  })
  @ApiResponse({
    status: 201,
    description: 'Record created successfully',
    schema: {
      example: {
        success: true,
        statusCode: 201,
        message: 'Record created successfully',
        data: {
          id: 'uuid-record-id',
          title: 'Session Notes',
          description: 'Patient progress notes...',
          createdAt: '2025-01-15T10:30:00Z',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or validation errors',
  })
  @Roles([ERole.PSYCHOLOGIST])
  create(@Body() dto: CreateRecordDto) {
    return this.recordsService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all medical records',
    description:
      'Retrieves all medical records in the system. Only administrators have access to all records.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all records retrieved successfully',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        message: 'Records retrieved successfully',
        data: [
          {
            id: 'uuid-record-1',
            title: 'Initial Assessment',
            description: 'First consultation notes...',
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
    summary: 'Get a medical record by ID',
    description:
      'Retrieves a specific medical record by its ID. Access depends on user role and ownership.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the medical record',
    example: 'uuid-record-id',
  })
  @ApiResponse({
    status: 200,
    description: 'Record retrieved successfully',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        message: 'Record retrieved successfully',
        data: {
          id: 'uuid-record-id',
          title: 'Session Notes',
          description: 'Detailed session notes...',
          createdAt: '2025-01-15T10:30:00Z',
          updatedAt: '2025-01-15T10:30:00Z',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Record not found or access denied',
  })
  @Roles([ERole.ADMIN, ERole.PSYCHOLOGIST, ERole.PATIENT])
  findOne(@Param('id') id: string) {
    return this.recordsService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: 'Get medical records by user ID',
    description:
      'Retrieves all medical records for a specific user/patient. Accessible by admins, psychologists, and the patient themselves.',
  })
  @ApiParam({
    name: 'userId',
    description: 'Unique identifier of the user/patient',
    example: 'uuid-user-id',
  })
  @ApiResponse({
    status: 200,
    description: 'User records retrieved successfully',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        message: 'User records retrieved successfully',
        data: [
          {
            id: 'uuid-record-1',
            title: 'Session 1',
            description: 'First session notes...',
            createdAt: '2025-01-15T10:30:00Z',
          },
          {
            id: 'uuid-record-2',
            title: 'Session 2',
            description: 'Second session notes...',
            createdAt: '2025-01-22T10:30:00Z',
          },
        ],
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User not found or no records available',
  })
  @Roles([ERole.ADMIN, ERole.PSYCHOLOGIST, ERole.PATIENT])
  findByUserId(@Param('userId') userId: string) {
    return this.recordsService.findByUserId(userId);
  }

  @Get('psychologist/:psychologistId')
  @ApiOperation({
    summary: 'Get medical records by psychologist ID',
    description:
      'Retrieves all medical records created by a specific psychologist. Accessible by admins and the psychologist themselves.',
  })
  @ApiParam({
    name: 'psychologistId',
    description: 'Unique identifier of the psychologist',
    example: 'uuid-psychologist-id',
  })
  @ApiResponse({
    status: 200,
    description: 'Psychologist records retrieved successfully',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        message: 'Psychologist records retrieved successfully',
        data: [
          {
            id: 'uuid-record-1',
            title: 'Patient A - Session 1',
            description: 'Session notes for Patient A...',
            createdAt: '2025-01-15T10:30:00Z',
          },
        ],
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Psychologist not found or no records available',
  })
  @Roles([ERole.ADMIN, ERole.PSYCHOLOGIST])
  findByPsychologistId(@Param('psychologistId') psychologistId: string) {
    return this.recordsService.findByPsychologistId(psychologistId);
  }

  @Get('user/:userId/psychologist/:psychologistId')
  @ApiOperation({
    summary: 'Get records by user and psychologist relationship',
    description:
      'Retrieves medical records for a specific user-psychologist relationship. Shows all records created by the psychologist for the specific patient.',
  })
  @ApiParam({
    name: 'userId',
    description: 'Unique identifier of the user/patient',
    example: 'uuid-user-id',
  })
  @ApiParam({
    name: 'psychologistId',
    description: 'Unique identifier of the psychologist',
    example: 'uuid-psychologist-id',
  })
  @ApiResponse({
    status: 200,
    description: 'Relationship records retrieved successfully',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        message: 'Relationship records retrieved successfully',
        data: [
          {
            id: 'uuid-record-1',
            title: 'Initial Assessment',
            description:
              'First consultation between patient and psychologist...',
            createdAt: '2025-01-15T10:30:00Z',
          },
        ],
      },
    },
  })
  @ApiNotFoundResponse({
    description:
      'User, psychologist not found or no records available for this relationship',
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
  @ApiOperation({
    summary: 'Update a medical record',
    description:
      'Updates an existing medical record. Only admins and the psychologist who created the record can update it.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the medical record to update',
    example: 'uuid-record-id',
  })
  @ApiResponse({
    status: 200,
    description: 'Record updated successfully',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        message: 'Record updated successfully',
        data: {
          id: 'uuid-record-id',
          title: 'Updated Session Notes',
          description: 'Updated session notes...',
          updatedAt: '2025-01-15T11:00:00Z',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or validation errors',
  })
  @ApiNotFoundResponse({
    description: 'Record not found or access denied',
  })
  @Roles([ERole.ADMIN, ERole.PSYCHOLOGIST])
  update(@Param('id') id: string, @Body() dto: UpdateRecordDto) {
    return this.recordsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a medical record',
    description:
      'Permanently deletes a medical record from the system. Only admins and the psychologist who created the record can delete it.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the medical record to delete',
    example: 'uuid-record-id',
  })
  @ApiResponse({
    status: 204,
    description: 'Record deleted successfully - No content returned',
  })
  @ApiNotFoundResponse({
    description: 'Record not found or access denied',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles([ERole.ADMIN, ERole.PSYCHOLOGIST])
  remove(@Param('id') id: string) {
    return this.recordsService.remove(id);
  }

  @Put(':id/soft-delete')
  @ApiOperation({
    summary: 'Soft delete a medical record',
    description:
      'Marks a medical record as inactive instead of permanently deleting it. Only admins and the psychologist who created the record can soft delete it.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the medical record to soft delete',
    example: 'uuid-record-id',
  })
  @ApiResponse({
    status: 200,
    description: 'Record soft deleted successfully',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        message: 'Record soft deleted successfully',
        data: {
          id: 'uuid-record-id',
          is_active: false,
          updated_at: '2025-01-15T12:00:00Z',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Record not found or access denied',
  })
  @Roles([ERole.ADMIN, ERole.PSYCHOLOGIST])
  softDelete(@Param('id') id: string) {
    return this.recordsService.softDelete(id);
  }
}
