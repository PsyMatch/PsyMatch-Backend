import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { ResponseUserDto } from '../users/dto/response-user.dto';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { ResponseType } from '../../common/decorators/response-type.decorator';
import { ImageValidationPipe } from '../files/pipes/image-validation.pipe';

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
          example: 'Juan Carlos Pérez',
          description: 'Full name of the user',
        },
        dni: {
          type: 'string',
          example: '12345678',
          description: 'User DNI (National Identity Document)',
        },
        email: {
          type: 'string',
          example: 'juan.perez@email.com',
          description: 'User email address (must be unique)',
        },
        password: {
          type: 'string',
          example: 'SecurePass123!',
          description: 'User password with security requirements',
        },
        confirmPassword: {
          type: 'string',
          example: 'SecurePass123!',
          description: 'Password confirmation (must match password)',
        },
        social_security_number: {
          type: 'string',
          example: '123-45-6789',
          description: 'User social security number (must be unique)',
        },
        profile_picture: {
          type: 'string',
          format: 'binary',
          description:
            'Optional profile picture (JPG, JPEG, PNG, WEBP - max 500KB)',
        },
        phone: {
          type: 'string',
          example: '1123456789',
          description: 'Optional phone number',
        },
        birthdate: {
          type: 'string',
          example: '15-05-1990',
          description: 'Optional birthdate in DD-MM-YYYY format',
        },
        address: {
          type: 'string',
          example: 'Av. Corrientes 1234, Buenos Aires, Argentina',
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
    description: 'User registered successfully',
    schema: {
      example: {
        message: 'User created successfully',
        data: {
          id: 'user-uuid',
          name: 'Juan Carlos Pérez',
          email: 'juan.perez@email.com',
          dni: 12345678,
          profile_picture: 'https://cloudinary.com/optimized-url',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid registration data' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async signUp(
    @Body() userData: SignUpDto,
    @UploadedFile(new ImageValidationPipe(true))
    profilePicture?: Express.Multer.File,
  ): Promise<{
    message: string;
    data: ResponseUserDto;
  }> {
    const newUser = await this.authService.signUpService(
      userData,
      profilePicture,
    );
    return { message: 'User created successfully', data: newUser };
  }

  @Post('signin')
  @ResponseType(ResponseUserDto)
  @ApiOperation({ summary: 'Sign in and get JWT token' })
  @ApiResponse({
    status: 200,
    description:
      'Login successful - JWT Token included in response. Copy token to use in protected routes.',
  })
  @ApiResponse({ status: 400, description: 'Invalid credentials' })
  @ApiResponse({ status: 401, description: 'Incorrect email or password' })
  async signIn(@Body() credentials: SignInDto): Promise<{
    message: string;
    data: ResponseUserDto;
    token: string;
  }> {
    const validatedUser = await this.authService.signInService(credentials);
    return {
      message: 'User logged in successfully',
      data: validatedUser.data,
      token: validatedUser.token,
    };
  }
}
