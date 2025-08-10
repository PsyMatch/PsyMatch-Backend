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
        social_security_number: {
          type: 'string',
          example: '987-65-4381',
          description: 'User social security number (must be unique)',
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
      },
      required: [
        'name',
        'dni',
        'email',
        'password',
        'confirmPassword',
        'social_security_number',
      ],
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

  @Post('signup-psychologist')
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
          example: 'Dr. Ana García',
          description: 'Full name of the psychologist',
        },
        dni: {
          type: 'string',
          example: '87654321',
          description: 'DNI (National Identity Document)',
        },
        email: {
          type: 'string',
          example: 'ana.garcia@psychologist.com',
          description: 'Email address (must be unique)',
        },
        password: {
          type: 'string',
          example: 'SecurePass123!',
          description: 'Password with security requirements',
        },
        confirmPassword: {
          type: 'string',
          example: 'SecurePass123!',
          description: 'Password confirmation (must match password)',
        },
        social_security_number: {
          type: 'string',
          example: '987-65-4321',
          description: 'Social security number (must be unique)',
        },
        phone: {
          type: 'string',
          example: '+5411777888999',
          description: 'Optional phone number',
        },
        address: {
          type: 'string',
          example: 'Av. Callao 1000, Buenos Aires',
          description: 'Optional address',
        },
        latitude: {
          type: 'string',
          example: '-34.6037',
          description: 'Optional latitude coordinate',
        },
        longitude: {
          type: 'string',
          example: '-58.3816',
          description: 'Optional longitude coordinate',
        },
        office_address: {
          type: 'string',
          example: 'Consultorio en Av. Callao 1000, Piso 5',
          description: 'Office address for consultations',
        },
        license_number: {
          type: 'string',
          example: 'PSI-12345',
          description: 'Professional license number',
        },
        specialities: {
          type: 'array',
          items: { type: 'string' },
          example: ['CLINICAL', 'COUNSELING'],
          description: 'Array of professional specialties',
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
        'social_security_number',
        'office_address',
        'license_number',
        'specialities',
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
          name: 'Dr. Ana García',
          email: 'ana.garcia@psychologist.com',
          dni: 87654321,
          office_address: 'Consultorio en Av. Callao 1000, Piso 5',
          license_number: 'PSI-12345',
          specialities: ['CLINICAL', 'COUNSELING'],
          verified: 'PENDING',
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
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ResponseType(ResponseUserDto)
  @ApiOperation({ summary: 'Sign in and get JWT token' })
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
