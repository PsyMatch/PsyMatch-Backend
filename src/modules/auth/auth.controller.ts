import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResponseUserDto } from '../users/dto/response-user.dto';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { ResponseType } from '../../common/decorators/response-type.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ResponseType(ResponseUserDto)
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid registration data' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async signUp(@Body() userData: SignUpDto): Promise<{
    message: string;
    data: ResponseUserDto;
  }> {
    const newUser = await this.authService.signUpService(userData);
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
