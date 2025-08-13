import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { ResponseUserDto } from '../users/dto/response-user.dto';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { SignUpPsychologistDto } from './dto/signup-psychologist.dto';
import { ResponseType } from '../../common/decorators/response-type.decorator';
import { FileValidationPipe } from '../files/pipes/file-validation.pipe';
import { User } from '../users/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { envs } from '../../configs/envs.config';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UseInterceptors(FileInterceptor('profile_picture'))
  @ResponseType(ResponseUserDto)
  @ApiOperation({
    summary: 'Registrar nuevo usuario',
    description:
      'Registra un nuevo usuario. La foto de perfil se sube a Cloudinary si se proporciona.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'María González',
          description: 'Nombre completo del usuario',
        },
        birthdate: {
          type: 'string',
          format: 'date',
          example: '1995-03-15',
          description: 'Fecha de nacimiento en formato YYYY-MM-DD',
        },
        phone: {
          type: 'string',
          example: '+5491155443322',
          description: 'Número de teléfono',
        },
        dni: {
          type: 'string',
          example: '98765432',
          description: 'DNI (Documento Nacional de Identidad)',
        },
        address: {
          type: 'string',
          example: 'Av. Santa Fe 1234, CABA, Argentina',
          description: 'Dirección',
        },
        latitude: {
          type: 'string',
          example: '-34.5998',
          description: 'Coordenada de latitud',
        },
        longitude: {
          type: 'string',
          example: '-58.3837',
          description: 'Coordenada de longitud',
        },
        email: {
          type: 'string',
          example: 'maria.gonzalez@gmail.com',
          description: 'Correo electrónico (debe ser único)',
        },
        password: {
          type: 'string',
          example: 'MiContraseña123!',
          description: 'Contraseña con requisitos de seguridad',
        },
        confirmPassword: {
          type: 'string',
          example: 'MiContraseña123!',
          description: 'Confirmación de contraseña (debe coincidir)',
        },
        health_insurance: {
          type: 'string',
          example: 'osde',
          description: 'Obra social (opcional)',
          enum: [
            'osde',
            'swiss-medical',
            'ioma',
            'pami',
            'unión-personal',
            'osdepy',
            'luis-pasteur',
            'jerarquicos-salud',
            'sancor-salud',
            'osecac',
            'osmecón-salud',
            'apross',
            'osprera',
            'ospat',
            'ase-nacional',
            'ospsip',
          ],
        },
        emergency_contact: {
          type: 'string',
          example: 'María Pérez - +5411987654321 - Madre',
          description: 'Contacto de emergencia (opcional)',
        },
        profile_picture: {
          type: 'string',
          format: 'binary',
          description:
            'Foto de perfil (JPG, JPEG, PNG, GIF, WEBP and AVIF - máx 2MB)',
        },
      },
      required: [
        'name',
        'dni',
        'email',
        'phone',
        'birthdate',
        'address',
        'password',
        'confirmPassword',
      ],
    },
  })
  @ApiResponse({
    status: 201,
    description:
      'Usuario registrado exitosamente - JWT Token incluido para login automático',
    schema: {
      example: {
        message: 'Usuario registrado exitosamente',
        data: {
          id: 'usuario-uuid',
          name: 'Juan Carlos Pérez',
          email: 'juan.perez@email.com',
          dni: 12345678,
          profile_picture: 'https://cloudinary.com/optimized-url',
        },
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos de registro inválidos' })
  @ApiResponse({ status: 409, description: 'El usuario ya existe' })
  async signUp(
    @Body() userData: SignUpDto,
    @UploadedFile(new FileValidationPipe({ isOptional: true }))
    profilePicture?: Express.Multer.File,
  ): Promise<{
    message: string;
    data: User;
    token: string;
  }> {
    return await this.authService.signUpService(userData, profilePicture);
  }

  @Post('signup/psychologist')
  @UseInterceptors(FileInterceptor('profile_picture'))
  @ResponseType(ResponseUserDto)
  @ApiOperation({
    summary: 'Registrar nuevo psicólogo',
    description:
      'Registra un nuevo psicólogo con credenciales profesionales. La foto de perfil se sube a Cloudinary si se proporciona.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Dr. Carlos Mendoza',
          description: 'Nombre completo del psicólogo',
        },
        birthdate: {
          type: 'string',
          format: 'date',
          example: '1985-03-15',
          description: 'Fecha de nacimiento en formato YYYY-MM-DD',
        },
        phone: {
          type: 'string',
          example: '+5411555123456',
          description: 'Número de teléfono',
        },
        dni: {
          type: 'number',
          example: 20123456,
          description: 'DNI (Documento Nacional de Identidad)',
        },
        office_address: {
          type: 'string',
          example: 'Consultorio en Av. Rivadavia 5000, 2do Piso',
          description: 'Dirección del consultorio (opcional)',
        },
        latitude: {
          type: 'string',
          example: '-34.6118',
          description: 'Coordenada de latitud',
        },
        longitude: {
          type: 'string',
          example: '-58.4173',
          description: 'Coordenada de longitud',
        },
        email: {
          type: 'string',
          example: 'carlos.mendoza@psychologist.com',
          description: 'Correo electrónico (debe ser único)',
        },
        password: {
          type: 'string',
          example: 'MiContraseñaSegura123!',
          description: 'Contraseña con requisitos de seguridad',
        },
        confirmPassword: {
          type: 'string',
          example: 'MiContraseñaSegura123!',
          description: 'Confirmación de contraseña (debe coincidir)',
        },
        profile_picture: {
          type: 'string',
          format: 'binary',
          description: 'Foto de perfil (JPG, JPEG, PNG, WEBP - máx 2MB)',
        },
        license_number: {
          type: 'number',
          example: 123451,
          description: 'Número de matrícula profesional (6 dígitos)',
          minimum: 100000,
          maximum: 999999,
        },
        personal_biography: {
          type: 'string',
          example:
            'Psicólogo especializado en terapia cognitivo conductual con 10 años de experiencia.',
          description: 'Biografía personal (opcional)',
        },
        professional_experience: {
          type: 'number',
          example: 5,
          description: 'Años de experiencia profesional (opcional)',
        },
        languages: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['spanish', 'english', 'portuguese'],
          },
          example: ['spanish', 'english'],
          description: 'Idiomas hablados',
        },
        therapy_approaches: {
          type: 'array',
          items: {
            type: 'string',
            enum: [
              'cognitive_behavioral_therapy',
              'acceptance_commitment_therapy',
              'psychodynamic_therapy',
              'family_systems_therapy',
              'solution_focused_brief_therapy',
              'play_therapy',
              'dialectical_behavioral_therapy',
              'eye_movement_desensitization_reprocessing',
              'humanistic_centred_therapy',
              'mindfulness_based_therapy',
              'gestalt_therapy',
              'art_therapy',
              'group_therapy',
            ],
          },
          example: ['cognitive_behavioral_therapy', 'psychodynamic_therapy'],
          description: 'Enfoques terapéuticos utilizados',
        },
        session_types: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['individual', 'couple', 'family', 'group'],
          },
          example: ['individual', 'couple'],
          description: 'Tipos de sesión ofrecidos',
        },
        modality: {
          type: 'string',
          example: 'in_person',
          description: 'Modalidad de consulta (opcional)',
          enum: ['in_person', 'online', 'hybrid'],
        },
        specialities: {
          type: 'array',
          items: {
            type: 'string',
            enum: [
              'anxiety_disorder',
              'depression',
              'trauma_ptsd',
              'addiction',
              'eating_disorder',
              'personality_disorder',
              'bipolar_disorder',
              'schizophrenia',
              'autism_spectrum',
              'adhd',
              'obsessive_compulsive',
              'panic_disorder',
              'social_anxiety',
              'phobias',
              'grief_loss',
              'relationship_issues',
              'family_therapy',
              'couples_therapy',
              'child_adolescent',
              'geriatric_psychology',
            ],
          },
          example: ['anxiety_disorder', 'depression', 'trauma_ptsd'],
          description: 'Lista de especialidades profesionales',
        },
        insurance_accepted: {
          type: 'array',
          items: {
            type: 'string',
            enum: [
              'osde',
              'swiss-medical',
              'ioma',
              'pami',
              'unión-personal',
              'osdepy',
              'luis-pasteur',
              'jerarquicos-salud',
              'sancor-salud',
              'osecac',
              'osmecón-salud',
              'apross',
              'osprera',
              'ospat',
              'ase-nacional',
              'ospsip',
            ],
          },
          example: ['osde', 'swiss-medical', 'ioma'],
          description: 'Lista de obras sociales aceptadas',
        },
        availability: {
          type: 'array',
          items: {
            type: 'string',
            enum: [
              'monday',
              'tuesday',
              'wednesday',
              'thursday',
              'friday',
              'saturday',
              'sunday',
            ],
          },
          example: ['monday', 'wednesday', 'friday'],
          description: 'Días disponibles para turnos',
        },
      },
      required: [
        'name',
        'phone',
        'dni',
        'birthdate',
        'email',
        'password',
        'confirmPassword',
        'personal_biography',
        'license_number',
        'professional_experience',
        'languages',
        'therapy_approaches',
        'session_types',
        'modality',
        'specialities',
        'insurance_accepted',
        'availability',
        'profile_picture',
      ],
    },
  })
  @ApiResponse({
    status: 201,
    description:
      'Psicólogo registrado exitosamente - JWT Token incluido para login automático',
    schema: {
      example: {
        message: 'Psicólogo registrado exitosamente',
        data: {
          id: 'psicologo-uuid',
          name: 'Dr. Carlos Mendoza',
          email: 'carlos.mendoza@psychologist.com',
          dni: 20123456,
          office_address: 'Consultorio en Av. Rivadavia 5000, 2do Piso',
          license_number: 123456,
          specialities: ['anxiety_disorder', 'depression', 'trauma_ptsd'],
          insurance_accepted: ['osde', 'swiss-medical', 'ioma'],
          availability: ['monday', 'wednesday', 'friday'],
          verified: 'pendiente',
          profile_picture: 'https://cloudinary.com/optimized-url',
        },
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos de registro inválidos' })
  @ApiResponse({ status: 409, description: 'El psicólogo ya existe' })
  async signUpPsychologist(
    @Body() userData: SignUpPsychologistDto,
    @UploadedFile(new FileValidationPipe({ isOptional: true }))
    profilePicture?: Express.Multer.File,
  ): Promise<{
    message: string;
    data: User;
    token: string;
  }> {
    return await this.authService.signUpPsychologistService(
      userData,
      profilePicture,
    );
  }

  @Post('signin')
  @UseInterceptors(FileInterceptor(''))
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ResponseType(ResponseUserDto)
  @ApiOperation({ summary: 'Iniciar sesión y obtener JWT token' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'tu@email.com',
          description: 'Correo electrónico del usuario',
        },
        password: {
          type: 'string',
          example: 'Contraseña123!',
          description: 'Contraseña del usuario',
        },
      },
      required: ['email', 'password'],
    },
  })
  @ApiResponse({
    status: 200,
    description:
      'Inicio de sesión exitoso - JWT Token incluido en la respuesta. Copia el token para usar en rutas protegidas.',
  })
  @ApiResponse({ status: 400, description: 'Credenciales inválidas' })
  @ApiResponse({
    status: 401,
    description: 'Correo electrónico o contraseña incorrectos',
  })
  @ApiResponse({
    status: 429,
    description:
      'Demasiados intentos de inicio de sesión. Por favor, intenta más tarde.',
  })
  async signIn(@Body() credentials: SignInDto): Promise<{
    message: string;
    data: User;
    token: string;
  }> {
    const validatedUser = await this.authService.signInService(credentials);
    return {
      message: 'Usuario autenticado exitosamente',
      data: validatedUser.data,
      token: validatedUser.token,
    };
  }

  @Get('google')
  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard('google'))
  googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    const jwt = this.authService.loginWithAuth(
      req.user as { id: number; email: string },
    );

    res.cookie('auth_token', jwt, {
      httpOnly: true,
      secure: envs.server.environment === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.redirect('http://localhost:3000/dashboard/user');
  }
}
