import { Controller, Req, Post, UseGuards, Param, Query } from '@nestjs/common';
import { MapsService } from './maps.service';
import { IAuthRequest } from '../auth/interfaces/auth-request.interface';
import { CombinedAuthGuard } from '../auth/guards/combined-auth.guard';
import { GetDirectionsSwaggerDoc } from './documentation/get-directions.doc';
import { ApiTags } from '@nestjs/swagger';
import { GetNearbyPsychologistsSwaggerDoc } from './documentation/get-nearby.dto';

@ApiTags('Mapas')
@Controller('maps')
export class MapsController {
  constructor(private readonly mapsService: MapsService) {}

  @Post('directions/:id')
  @UseGuards(CombinedAuthGuard)
  @GetDirectionsSwaggerDoc()
  async getDirections(@Req() req: IAuthRequest, @Param('id') id: string) {
    const patientId = req.user.id;
    const psychologistId = id;
    const directions = await this.mapsService.getDirections(
      patientId,
      psychologistId,
    );
    return { message: 'Direcciones obtenidas con éxito', directions };
  }

  @Post('nearby')
  @UseGuards(CombinedAuthGuard)
  @GetNearbyPsychologistsSwaggerDoc()
  async getNearbyPsychologists(
    @Req() req: IAuthRequest,
    @Query('distance') maxDistance = 5,
  ): Promise<{
    message: string;
    psychologists: Array<{
      name: string;
      address: string;
      distance: number;
      link: string;
    }>;
  }> {
    const patientId = req.user.id;
    const nearby = await this.mapsService.getNearbyPsychologistsList(
      patientId,
      maxDistance,
    );

    return {
      message: `Se encontraron ${nearby.length} psicólogos en un radio de ${maxDistance} km`,
      psychologists: nearby,
    };
  }
}
