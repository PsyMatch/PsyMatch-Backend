import { Controller, Body, Param, Delete, Put } from '@nestjs/common';
import { PsychologistService } from './psychologist.service';
import { UpdatePsychologistDto } from '../../dto/update-psychologist.dto';
import { ApiOperation, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('Psychologist')
@Controller('psychologist')
export class PsychologistController {
  constructor(private readonly psychologistService: PsychologistService) {}

  // @Put(':id')
  // @ApiConsumes('multipart/form-data')
  // @ApiOperation({
  //   summary: 'Update psychologist information',
  //   description: 'Update psychologist profile information.',
  // })
  // @ApiBody({
  //   description: 'Psychologist update data (form-data)',
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       license_number: {
  //         type: 'string',
  //         description: 'Professional license number',
  //         example: 'PSY-123456',
  //       },
  //       specialities: {
  //         type: 'string',
  //         description: 'Comma-separated specialties',
  //         example: 'anxiety,depression,trauma',
  //       },
  //       experience_years: {
  //         type: 'string',
  //         description: 'Years of experience',
  //         example: '5',
  //       },
  //       modality: {
  //         type: 'string',
  //         description: 'Therapy modality',
  //         enum: ['PRESENTIAL', 'VIRTUAL', 'MIXED'],
  //         example: 'VIRTUAL',
  //       },
  //       rate_per_session: {
  //         type: 'string',
  //         description: 'Session rate in USD',
  //         example: '80.00',
  //       },
  //       bio: {
  //         type: 'string',
  //         description: 'Professional biography',
  //         example: 'Licensed clinical psychologist with 5+ years experience...',
  //       },
  //       availability: {
  //         type: 'string',
  //         description: 'Available time slots (JSON format)',
  //         example: '{"monday": ["09:00-12:00", "14:00-18:00"]}',
  //       },
  //     },
  //   },
  // })
  // update(
  //   @Param('id') id: string,
  //   @Body() updatePsychologistDto: UpdatePsychologistDto,
  // ) {
  //   return this.psychologistService.update(id, updatePsychologistDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.psychologistService.remove(id);
  // }
}
