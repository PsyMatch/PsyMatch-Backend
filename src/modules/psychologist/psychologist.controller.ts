import {
  Body,
  Controller,
  Get,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  PaginatedResponse,
  PaginationDto,
} from 'src/common/dto/pagination.dto';
import { CombinedAuthGuard } from 'src/modules/auth/guards/combined-auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { IAuthRequest } from 'src/modules/auth/interfaces/auth-request.interface';
import { Reviews } from 'src/modules/reviews/entities/reviews.entity';
import { Roles } from 'src/modules/auth/decorators/role.decorator';
import { ERole } from 'src/common/enums/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { EInsurance } from 'src/modules/users/enums/insurances.enum';
import { FileValidationPipe } from 'src/modules/files/pipes/file-validation.pipe';
import { Payment } from 'mercadopago';
import { ResponseUserDto } from 'src/modules/users/dto/response-user.dto';
import { Appointment } from 'src/modules/appointments/entities/appointment.entity';
import { PsychologistService } from './psychologist.service';
import { ResponseProfessionalDto } from './dto/response-professional.dto';
import { EPsychologistSpecialty } from './enums/specialities.enum';
import { ETherapyApproach } from './enums/therapy-approaches.enum';
import { ESessionType } from './enums/session-types.enum';
import { EModality } from './enums/modality.enum';
import { UpdatePsychologistDto } from './dto/update-psychologist.dto';

@Controller('psychologist')
@ApiTags('Profesionales')
@ApiBearerAuth('JWT-auth')
@UseGuards(CombinedAuthGuard, RolesGuard)
export class PsychologistController {
  constructor(private readonly psychologistService: PsychologistService) {}

  @Get('verification/verified')
  @ApiOperation({
    summary: 'Obterner todos los profesionales verificados',
    description: 'Obtener una lista paginada de psicólogos verificados',
  })
  @ApiResponse({
    status: 200,
    description: 'Psicólogos verificados recuperados exitosamente',
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
              verified: { type: 'string', example: 'verified' },
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
    description: 'Acceso denegado - Se requiere rol de administrador',
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido o expirado',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontraron solicitudes de psicólogos verificados',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página (por defecto: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Elementos por página (por defecto: 5)',
    example: 10,
  })
  getAllVerifiedController(
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<ResponseProfessionalDto>> {
    return this.psychologistService.getAllVerifiedService(paginationDto);
  }

  @Get('reviews')
  @ApiOperation({
    summary: 'Obtener todas las reseñas del psicólogo autenticado',
    description:
      'Obtener una lista de todas las reseñas escritas para el psicólogo autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de reseñas recuperadas exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontraron reseñas',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async findAll(
    @Req() req: IAuthRequest,
  ): Promise<{ message: string; data: Reviews }> {
    const userId = req.user.id;
    return await this.psychologistService.findAll(userId);
  }

  @Get('me')
  @Roles([ERole.PSYCHOLOGIST])
  @ApiOperation({ summary: 'Obtener perfil del psicólogo logueado' })
  @ApiResponse({
    status: 200,
    description: 'Devuelve la información del perfil del psicólogo logueado',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token inválido o faltante',
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido - No es un psicólogo',
  })
  @ApiResponse({
    status: 404,
    description: 'Perfil no encontrado',
  })
  async getMe(
    @Req() req: IAuthRequest,
  ): Promise<{ message: string; data: ResponseProfessionalDto }> {
    const userId = req.user.id;
    return await this.psychologistService.getPsychologistProfile(userId);
  }

  @Put('me')
  @UseInterceptors(FileInterceptor('profile_picture'))
  @Roles([ERole.PSYCHOLOGIST])
  @ApiOperation({ summary: 'Actualizar perfil del psicólogo logueado' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      allOf: [
        { $ref: '#/components/schemas/UpdatePsychologistDto' },
        {
          type: 'object',
          properties: {
            profile_picture: {
              type: 'string',
              format: 'binary',
              description: 'Imagen de perfil del psicólogo (archivo)',
            },
          },
        },
      ],
    },
    description:
      'Datos actualizables del perfil del psicólogo, incluyendo imagen de perfil',
    examples: {
      fullUpdate: {
        value: {
          license_number: 'PSI-12345-BA',
          office_address: 'Av. Corrientes 1234, Oficina 302, Buenos Aires',
          professional_experience: 5,
          specialities: [
            EPsychologistSpecialty.ANXIETY_DISORDER,
            EPsychologistSpecialty.DEPRESSION,
          ],
          therapy_approaches: [ETherapyApproach.COGNITIVE_BEHAVIORAL_THERAPY],
          session_types: [ESessionType.INDIVIDUAL],
          modality: EModality.ONLINE,
          insurance_accepted: [EInsurance.OSDE, EInsurance.SWISS_MEDICAL],
          personal_biography:
            'Psicólogo clínico licenciado con más de 5 años de experiencia...',
          availability: '{"lunes": ["09:00-12:00", "14:00-18:00"]}',
          professional_title: 'Licenciado en Psicología',
          profile_picture: 'file',
        },
        description: 'Ejemplo de actualización completa del perfil con imagen',
      },
      partialUpdate: {
        value: {
          office_address: 'Av. Corrientes 1234, Oficina 302, Buenos Aires',
          modality: EModality.HYBRID,
          specialities: [EPsychologistSpecialty.ANXIETY_DISORDER],
          insurance_accepted: [EInsurance.OSDE],
          profile_picture: 'file',
        },
        description: 'Ejemplo de actualización parcial del perfil con imagen',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Devuelve la información del perfil del psicólogo actualizado',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token inválido o faltante',
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido - No es un psicólogo',
  })
  @ApiResponse({
    status: 404,
    description: 'Perfil no encontrado',
  })
  async updateMe(
    @Req() req: IAuthRequest,
    @Body() updateDto: UpdatePsychologistDto,
    @UploadedFile(new FileValidationPipe({ isOptional: true }))
    profilePicture?: Express.Multer.File,
  ): Promise<{ message: string; data: ResponseProfessionalDto }> {
    return await this.psychologistService.updatePsychologistProfile(
      req.user.id,
      req.user.role,
      updateDto,
      profilePicture,
    );
  }

  @Get('payments')
  @Roles([ERole.PSYCHOLOGIST])
  @ApiOperation({ summary: 'Obtener los pagos del psicólogo logueado' })
  @ApiResponse({ status: 200, description: 'Pagos recuperados exitosamente' })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token inválido o faltante',
  })
  @ApiResponse({ status: 403, description: 'Prohibido - No es un psicólogo' })
  @ApiResponse({ status: 404, description: 'No se encontraron pagos' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async getPayments(
    @Req() request: IAuthRequest,
  ): Promise<{ message: string; data: Payment[] }> {
    const userId = request.user.id;
    return await this.psychologistService.getPaymentsOfProfessional(userId);
  }

  @Get('patients')
  @Roles([ERole.PSYCHOLOGIST])
  @ApiOperation({
    summary: 'Obtener pacientes asignados al psicólogo logueado',
  })
  @ApiResponse({
    status: 200,
    description: 'Devuelve la lista de pacientes asignados al psicólogo',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token inválido o faltante',
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido - No es un psicólogo',
  })
  async getPatients(
    @Req() req: IAuthRequest,
  ): Promise<{ message: string; data: ResponseUserDto[] }> {
    const userId = req.user.id;
    return await this.psychologistService.getPatientsForPsychologist(userId);
  }

  @Get('appointments')
  @ApiOperation({
    summary: '[Turnos] Obtener turnos del psicólogo',
    description: 'Obtener todos los turnos del psicólogo logueado',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de turnos recuperados exitosamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token inválido o faltante',
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido - No es un psicólogo',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontraron turnos',
  })
  async getAppointments(
    @Req() request: IAuthRequest,
  ): Promise<{ message: string; data: Appointment[] }> {
    const userId = request.user.id;
    return this.psychologistService.getAppointmentsOfProfessional(userId);
  }
}
