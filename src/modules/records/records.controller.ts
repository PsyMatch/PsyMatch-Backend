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

@Controller('records')
@UseGuards(AuthGuard, RolesGuard)
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Roles([ERole.PSYCHOLOGIST])
  @Post()
  create(@Body() dto: CreateRecordDto) {
    return this.recordsService.create(dto);
  }

  @Roles([ERole.ADMIN])
  @Get()
  findAll() {
    return this.recordsService.findAll();
  }

  @Roles([ERole.ADMIN, ERole.PSYCHOLOGIST, ERole.PATIENT])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recordsService.findOne(id);
  }

  @Roles([ERole.ADMIN, ERole.PSYCHOLOGIST, ERole.PATIENT])
  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.recordsService.findByUserId(userId);
  }

  @Roles([ERole.ADMIN, ERole.PSYCHOLOGIST])
  @Get('psychologist/:psychologistId')
  findByPsychologistId(@Param('psychologistId') psychologistId: string) {
    return this.recordsService.findByPsychologistId(psychologistId);
  }

  @Roles([ERole.ADMIN, ERole.PSYCHOLOGIST])
  @Get('user/:userId/psychologist/:psychologistId')
  findByUserAndPsychologist(
    @Param('userId') userId: string,
    @Param('psychologistId') psychologistId: string,
  ) {
    return this.recordsService.findByUserAndPsychologist(
      userId,
      psychologistId,
    );
  }

  @Roles([ERole.ADMIN, ERole.PSYCHOLOGIST])
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRecordDto) {
    return this.recordsService.update(id, dto);
  }

  @Roles([ERole.ADMIN, ERole.PSYCHOLOGIST])
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.recordsService.remove(id);
  }
}
