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
import { ApiTags, ApiExcludeEndpoint } from '@nestjs/swagger';
import { SignUpPsychologistSwaggerDoc } from './documentation/signup-psychologist.doc';
import { SignUpSwaggerDoc } from './documentation/signup.doc';
import { SignInSwaggerDoc } from './documentation/signin.doc';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UseInterceptors(FileInterceptor('profile_picture'))
  @ResponseType(ResponseUserDto)
  @SignUpSwaggerDoc()
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
  @SignUpPsychologistSwaggerDoc()
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
  @SignInSwaggerDoc()
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
      httpOnly: false,
      secure: envs.server.environment === 'production',
      sameSite: envs.server.environment === 'production' ? 'none' : 'lax',
      domain:
        envs.server.environment === 'production' ? '.onrender.com' : undefined,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    //PRODUCTION RETURN
    return res.redirect(
      'https://psymatch-frontend-app.onrender.com/dashboard/user',
    );

    //DEVELOPMENT RETURN
    // return res.redirect('http://localhost:3000/dashboard/user');
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getCurrentUser(@Req() req: Request): {
    message: string;
    data: User;
  } {
    return {
      message: 'Usuario autorizado',
      data: req.user as User,
    };
  }

  @Post('logout')
  logout(@Res() res: Response): void {
    res.clearCookie('auth_token');
    res.json({
      message: 'Usuario desautorizado',
    });
  }
}
