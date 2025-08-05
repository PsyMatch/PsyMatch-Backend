import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUpController(@Body() userData: SignUpDto) {
    return this.authService.signUpService(userData);
  }

  @Post('signin')
  signInController(@Body() userData: SignInDto) {
    return this.authService.signInService(userData);
  }
}
