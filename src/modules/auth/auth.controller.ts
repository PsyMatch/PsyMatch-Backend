import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpAuthDto } from './dto/create-auth.dto';
import { SignInAuthDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUpController(@Body() req: SignUpAuthDto) {
    return this.authService.signUpService(req);
  }

  @Post('signin')
  signInController(@Body() req: SignInAuthDto) {
    return this.authService.signInService(req);
  }
}
