import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PsychologistService } from './psychologist.service';
import { ValidatePsychologistDto } from './dto/validate-psychologist.dto';
import { UpdatePsychologistDto } from './dto/update-psychologist.dto';
import { IAuthRequest } from '../auth/interfaces/auth-request.interface';
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

  @Post('register')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([ERole.PATIENT, ERole.ADMIN])
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Register a new psychologist',
  })
  @ApiResponse({
    status: 201,
    description: 'Psychologist registered successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data provided',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied - Patient or Admin role required',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired token',
  })
  validateNewPsychologistAccountController(
    @Req() req: IAuthRequest,
    @Body() createPsychologistDto: ValidatePsychologistDto,
  ): Promise<{ message: string }> {
    return this.psychologistService.validateNewPsychologistAccountService({
      createPsychologistDto,
      req: {
        user: { id: req.user.id },
      },
    });
  }

  @Get('pending')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([ERole.ADMIN])
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get all pending psychologists (Admin Only)',
  })
  @ApiResponse({
    status: 200,
    description: 'Pending psychologists retrieved successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied - Admin role required',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired token',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
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
  })
  @ApiResponse({
    status: 200,
    description: 'Psychologist verified successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied - Admin role required',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired token',
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
