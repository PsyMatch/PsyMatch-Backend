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
import { envs } from 'src/configs/envs.config';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UseInterceptors(FileInterceptor('profile_picture'))
  @ResponseType(ResponseUserDto)
  @ApiOperation({
    summary: 'Register new user',
    description:
      'Register a new user with optional profile picture upload. Profile picture is uploaded to Cloudinary if provided.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'María González',
          description: 'Full name of the user',
        },
        dni: {
          type: 'string',
          example: '98765432',
          description: 'User DNI (National Identity Document)',
        },
        email: {
          type: 'string',
          example: 'maria.gonzalez@gmail.com',
          description: 'User email address (must be unique)',
        },
        password: {
          type: 'string',
          example: 'MyPassword123!',
          description: 'User password with security requirements',
        },
        confirmPassword: {
          type: 'string',
          example: 'MyPassword123!',
          description: 'Password confirmation (must match password)',
        },
        profile_picture: {
          type: 'string',
          format: 'binary',
          description:
            'Optional profile picture (JPG, JPEG, PNG, WEBP - max 2MB)',
        },
        phone: {
          type: 'string',
          example: '+5491155443322',
          description: 'Optional phone number',
        },
        birthdate: {
          type: 'string',
          format: 'date',
          example: '1995-03-15',
          description: 'Optional birthdate in YYYY-MM-DD format',
        },
        address: {
          type: 'string',
          example: 'Av. Santa Fe 1234, CABA, Argentina',
          description: 'Optional address',
        },
        latitude: {
          type: 'string',
          example: '-34.5998',
          description: 'Optional latitude coordinate',
        },
        longitude: {
          type: 'string',
          example: '-58.3837',
          description: 'Optional longitude coordinate',
        },
        health_insurance: {
          type: 'string',
          example: 'osde',
          description: 'Optional health insurance provider',
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
          description: 'Optional emergency contact information',
        },
      },
      required: ['name', 'dni', 'email', 'password', 'confirmPassword'],
    },
  })
  @ApiResponse({
    status: 201,
    description:
      'User registered successfully - JWT Token included for automatic login',
    schema: {
      example: {
        message: 'User successfully registered',
        data: {
          id: 'user-uuid',
          name: 'Juan Carlos Pérez',
          email: 'juan.perez@email.com',
          dni: 12345678,
          profile_picture: 'https://cloudinary.com/optimized-url',
        },
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid registration data' })
  @ApiResponse({ status: 409, description: 'User already exists' })
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
    summary: 'Register new psychologist',
    description:
      'Register a new psychologist with professional credentials. Profile picture is uploaded to Cloudinary if provided.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Dr. Carlos Mendoza',
          description: 'Full name of the psychologist',
        },
        phone: {
          type: 'string',
          example: '+5411555123456',
          description: 'Optional phone number',
        },
        dni: {
          type: 'number',
          example: 20123456,
          description: 'DNI (National Identity Document)',
        },
        birthdate: {
          type: 'string',
          format: 'date',
          example: '1985-03-15',
          description: 'Optional birthdate in YYYY-MM-DD format',
        },
        email: {
          type: 'string',
          example: 'carlos.mendoza@psychologist.com',
          description: 'Email address (must be unique)',
        },
        latitude: {
          type: 'string',
          example: '-34.6118',
          description: 'Optional latitude coordinate',
        },
        longitude: {
          type: 'string',
          example: '-58.4173',
          description: 'Optional longitude coordinate',
        },
        office_address: {
          type: 'string',
          example: 'Consultorio en Av. Rivadavia 5000, 2do Piso',
          description: 'Optional office address for consultations',
        },
        license_number: {
          type: 'number',
          example: 123451,
          description: 'Professional license number (6 digits)',
          minimum: 100000,
          maximum: 999999,
        },
        personal_biography: {
          type: 'string',
          example:
            'Psychologist specialized in cognitive behavioral therapy with 10 years of experience.',
          description: 'Optional personal biography',
        },
        professional_experience: {
          type: 'number',
          example: 5,
          description: 'Optional years of professional experience',
        },
        languages: {
          type: 'string',
          example: 'spanish,english',
          description: 'Optional comma-separated languages spoken',
        },
        therapy_approaches: {
          type: 'string',
          example: 'cognitive_behavioral_therapy,psychodynamic_therapy',
          description: 'Optional comma-separated therapy approaches',
        },
        session_types: {
          type: 'string',
          example: 'individual,couple',
          description: 'Optional comma-separated session types offered',
        },
        modality: {
          type: 'string',
          example: 'in_person',
          description: 'Optional consultation modality',
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
          description: 'Array of professional specialties',
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
          description: 'Array of insurance providers accepted',
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
          description: 'Array of available days for appointments',
        },
        password: {
          type: 'string',
          example: 'MySecurePassword123!',
          description: 'Password with security requirements',
        },
        confirmPassword: {
          type: 'string',
          example: 'MySecurePassword123!',
          description: 'Password confirmation (must match password)',
        },
        profile_picture: {
          type: 'string',
          format: 'binary',
          description:
            'Optional profile picture (JPG, JPEG, PNG, WEBP - max 2MB)',
        },
      },
      required: [
        'name',
        'dni',
        'email',
        'password',
        'confirmPassword',
        'license_number',
        'insurance_accepted',
        'specialities',
        'availability',
      ],
    },
  })
  @ApiResponse({
    status: 201,
    description:
      'Psychologist registered successfully - JWT Token included for automatic login',
    schema: {
      example: {
        message: 'Psychologist successfully registered',
        data: {
          id: 'psychologist-uuid',
          name: 'Dr. Carlos Mendoza',
          email: 'carlos.mendoza@psychologist.com',
          dni: 20123456,
          office_address: 'Consultorio en Av. Rivadavia 5000, 2do Piso',
          license_number: 123456,
          specialities: ['anxiety_disorder', 'depression', 'trauma_ptsd'],
          insurance_accepted: ['osde', 'swiss-medical', 'ioma'],
          availability: ['monday', 'wednesday', 'friday'],
          verified: 'pending',
          profile_picture: 'https://cloudinary.com/optimized-url',
        },
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid registration data' })
  @ApiResponse({ status: 409, description: 'Psychologist already exists' })
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
  @ApiOperation({ summary: 'Sign in and get JWT token' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'admin@psymatch.com',
          description: 'User email address',
        },
        password: {
          type: 'string',
          example: 'Abcd1234!',
          description: 'User password',
        },
      },
      required: ['email', 'password'],
    },
  })
  @ApiResponse({
    status: 200,
    description:
      'Login successful - JWT Token included in response. Copy token to use in protected routes.',
  })
  @ApiResponse({ status: 400, description: 'Invalid credentials' })
  @ApiResponse({ status: 401, description: 'Incorrect email or password' })
  @ApiResponse({
    status: 429,
    description: 'Too many login attempts. Please try again later.',
  })
  async signIn(@Body() credentials: SignInDto): Promise<{
    message: string;
    data: User;
    token: string;
  }> {
    const validatedUser = await this.authService.signInService(credentials);
    return {
      message: 'User logged in successfully',
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
