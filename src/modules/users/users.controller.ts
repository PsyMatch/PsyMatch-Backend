import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JWTAuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { IAuthRequest } from '../auth/interfaces/auth-request.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileValidationPipe } from '../files/pipes/file-validation.pipe';
import { ERole } from '../../common/enums/role.enum';
import { Roles } from '../auth/decorators/role.decorator';
import { ResponseType } from '../../common/decorators/response-type.decorator';
import { ResponseUserDto } from './dto/response-user.dto';
import {
  PaginatedResponse,
  PaginationDto,
} from '../../common/dto/pagination.dto';
import { Payment } from '../payments/entities/payment.entity';
import { User } from './entities/user.entity';
import { Appointment } from '../appointments/entities/appointment.entity';
import { Psychologist } from '../psychologist/entities/psychologist.entity';
import { DeleteSwaggerDoc } from './documentation/delete.doc';
import { FindAllPatientsSwaggerDoc } from './documentation/find-all-patients.doc';
import { FindAllSwaggerDoc } from './documentation/find-all.doc';
import { FindByIdSwaggerDoc } from './documentation/find-by-id.doc';
import { GetMyAppointmentsSwaggerDoc } from './documentation/get-my-appointments.doc';
import { GetMyPaymentsSwaggerDoc } from './documentation/get-my-payments.doc';
import { GetMyPsychologistsSwaggerDoc } from './documentation/get-my-psichologists.doc';
import { UpdateSwaggerDoc } from './documentation/update.doc';
import { GetMyDataSwaggerDoc } from './documentation/get-my-data.doc';
import { UpdateUserResponseDto } from './dto/update-user-response.dto';
import { ResponsePublicUserDto } from './dto/response-public-user.dto';
import { FindPublicByIdSwaggerDoc } from './documentation/find-public-id.doc';

@ApiTags('Usuarios')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles([ERole.ADMIN])
  @FindAllSwaggerDoc()
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<{ message: string; data: PaginatedResponse<User> }> {
    const users = await this.usersService.findAll(paginationDto);
    return {
      message: 'Lista de usuarios recuperada exitosamente',
      data: users,
    };
  }

  @Get('patients')
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles([ERole.ADMIN])
  @FindAllPatientsSwaggerDoc()
  async findAllPatients(
    @Query() paginationDto: PaginationDto,
  ): Promise<{ message: string; data: PaginatedResponse<User> }> {
    const patients = await this.usersService.findAllPatients(paginationDto);
    return {
      message: 'Todos los pacientes recuperados exitosamente',
      data: patients,
    };
  }

  @Get('me')
  @UseGuards(JWTAuthGuard)
  @ResponseType(ResponseUserDto)
  @GetMyDataSwaggerDoc()
  async getMyData(
    @Req() req: IAuthRequest,
  ): Promise<{ message: string; data: User }> {
    const requester = req.user.id;
    const user = await this.usersService.findById(requester, requester);
    return {
      message: 'Información del usuario recuperada exitosamente',
      data: user,
    };
  }

  @Put('me')
  @UseGuards(JWTAuthGuard)
  @UseInterceptors(FileInterceptor('profile_picture'))
  @UpdateSwaggerDoc()
  async updateMe(
    @Req() req: IAuthRequest,
    @Body() userData: UpdateUserDto,
    @UploadedFile(new FileValidationPipe({ isOptional: true }))
    profilePicture?: Express.Multer.File,
  ): Promise<{ message: string; data: UpdateUserResponseDto }> {
    const requester = req.user.id;
    const userRole = req.user.role;
    const updatedFields = await this.usersService.update(
      requester,
      userData,
      requester,
      userRole,
      profilePicture,
    );

    return {
      message: 'Paciente actualizado exitosamente',
      data: updatedFields,
    };
  }

  @Get('me/psychologists')
  @UseGuards(JWTAuthGuard)
  @GetMyPsychologistsSwaggerDoc()
  async getMyPsychologists(
    @Req() req: IAuthRequest,
    @Query() paginationDto: PaginationDto,
  ): Promise<{ message: string; data: PaginatedResponse<Psychologist> }> {
    const requester = req.user.id;
    const psychologists = await this.usersService.getMyPsychologists(
      requester,
      paginationDto,
    );
    return {
      message: 'Lista de los psicólogos del paciente recuperados exitosamente',
      data: psychologists,
    };
  }

  @Get('me/appointments')
  @UseGuards(JWTAuthGuard)
  @GetMyAppointmentsSwaggerDoc()
  async getMyAppointments(
    @Req() req: IAuthRequest,
    @Query() paginationDto: PaginationDto,
  ): Promise<{ message: string; data: PaginatedResponse<Appointment> }> {
    const requester = req.user.id;
    const appointments = await this.usersService.getMyAppointments(
      requester,
      paginationDto,
    );
    return {
      message: 'Lista de las citas del paciente recuperadas exitosamente',
      data: appointments,
    };
  }

  @Get('me/payments')
  @UseGuards(JWTAuthGuard)
  @GetMyPaymentsSwaggerDoc()
  async getMyPayments(
    @Req() request: IAuthRequest,
    @Query() paginationDto: PaginationDto,
  ): Promise<{
    message: string;
    data: PaginatedResponse<Payment>;
  }> {
    const requester = request.user.id;
    const payments = await this.usersService.getMyPayments(
      requester,
      paginationDto,
    );
    return {
      message: 'Lista de pagos del paciente recuperada exitosamente',
      data: payments,
    };
  }

  @Get(':id')
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles([ERole.ADMIN])
  @FindByIdSwaggerDoc()
  async findById(
    @Req() req: IAuthRequest,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string; data: ResponseUserDto }> {
    const requester = req.user.id;
    const user = await this.usersService.findById(id, requester);
    return {
      message: 'Usuario encontrado exitosamente',
      data: user as unknown as ResponseUserDto,
    };
  }

  @Get('public/:id')
  @UseGuards(JWTAuthGuard)
  @FindPublicByIdSwaggerDoc()
  @ResponseType(ResponsePublicUserDto)
  async findPublicById(
    @Req() req: IAuthRequest,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string; data: ResponsePublicUserDto }> {
    const requester = req.user.id;
    const user = await this.usersService.findById(id, requester);
    return {
      message: 'Usuario encontrado exitosamente',
      data: user as unknown as ResponsePublicUserDto,
    };
  }

  @Put(':id')
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles([ERole.ADMIN])
  @UseInterceptors(FileInterceptor('profile_picture'))
  @UpdateSwaggerDoc()
  async update(
    @Req() req: IAuthRequest,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() userData: UpdateUserDto,
    @UploadedFile(new FileValidationPipe({ isOptional: true }))
    profilePicture?: Express.Multer.File,
  ): Promise<{ message: string; data: UpdateUserResponseDto }> {
    const updatedUser = await this.usersService.update(
      id,
      userData,
      req.user.id,
      req.user.role,
      profilePicture,
    );
    return { message: 'Usuario actualizado exitosamente', data: updatedUser };
  }

  @Delete(':id')
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles([ERole.ADMIN])
  @DeleteSwaggerDoc()
  async delete(
    @Req() req: IAuthRequest,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string; id: string }> {
    const requester = await this.usersService.delete(
      id,
      req.user.id,
      req.user.role,
    );
    return { message: 'Usuario eliminado exitosamente', id: requester };
  }
}
