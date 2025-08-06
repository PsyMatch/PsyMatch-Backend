import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Req,
} from '@nestjs/common';
import { PsychologistService } from './psychologist.service';
import { ValidatePsychologistDto } from './dto/validate-psychologist.dto';
import { UpdatePsychologistDto } from './dto/update-psychologist.dto';
import { IAuthRequest } from '../auth/interfaces/auth-request.interface';

@Controller('psychologist')
export class PsychologistController {
  constructor(private readonly psychologistService: PsychologistService) {}

  @Post()
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

  @Get()
  findAll() {
    return this.psychologistService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
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
