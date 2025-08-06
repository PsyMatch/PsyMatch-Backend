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
import { ERole } from '../users/enums/role.enum';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('records')
@ApiTags('Records')
@UseGuards(AuthGuard, RolesGuard)
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create a new record',
  })
  @Roles([ERole.PSYCHOLOGIST])
  create(@Body() dto: CreateRecordDto) {
    return this.recordsService.create(dto);
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get all records',
  })
  @Roles([ERole.ADMIN])
  findAll() {
    return this.recordsService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get a record by ID',
  })
  @Roles([ERole.ADMIN, ERole.PSYCHOLOGIST, ERole.PATIENT])
  findOne(@Param('id') id: string) {
    return this.recordsService.findOne(id);
  }

  @Get('user/:userId')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get records by user ID',
  })
  @Roles([ERole.ADMIN, ERole.PSYCHOLOGIST, ERole.PATIENT])
  findByUserId(@Param('userId') userId: string) {
    return this.recordsService.findByUserId(userId);
  }

  @Get('psychologist/:psychologistId')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get records by psychologist ID',
  })
  @Roles([ERole.ADMIN, ERole.PSYCHOLOGIST])
  findByPsychologistId(@Param('psychologistId') psychologistId: string) {
    return this.recordsService.findByPsychologistId(psychologistId);
  }

  @Get('user/:userId/psychologist/:psychologistId')
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
  @Roles([ERole.ADMIN, ERole.PSYCHOLOGIST])
  update(@Param('id') id: string, @Body() dto: UpdateRecordDto) {
    return this.recordsService.update(id, dto);
  }

  @Delete(':id')
  @Roles([ERole.ADMIN, ERole.PSYCHOLOGIST])
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.recordsService.remove(id);
  }
}
