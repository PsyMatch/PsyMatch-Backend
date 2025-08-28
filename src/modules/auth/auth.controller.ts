import {
  BadRequestException,
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
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { EmailsService } from '../emails/emails.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailsService: EmailsService,
  ) {}

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
    const response = await this.authService.signUpService(
      userData,
      profilePicture,
    );
    await this.emailsService.sendWelcomeEmail(response.data.email);
    return response;
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
    const response = await this.authService.signUpPsychologistService(
      userData,
      profilePicture,
    );

    await this.emailsService.sendWelcomeEmail(response.data.email);
    return response;
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
  @UseGuards(AuthGuard('google'))
  googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    try {
      if (!req.user) {
        throw new BadRequestException('Google login failed');
      }

      const user = req.user as User;
      const jwt = this.authService.loginWithAuth(user);

      const role = user.role || 'Paciente';
      res.cookie('auth_token', jwt, {
        httpOnly: false,
        secure: true,
        sameSite: 'none',
        domain:
          envs.server.environment === 'production'
            ? '.onrender.com'
            : undefined,
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      const frontendUrl = envs.deployed_urls.frontend;
      return res.redirect(
        `${frontendUrl}/oauth-callback?token=${jwt}&role=${role}`,
      );
    } catch (error) {
      console.error('Error en OAuth callback:', error);
      const frontendUrl = envs.deployed_urls.frontend;
      return res.redirect(`${frontendUrl}/login?error=oauth_failed`);
    }
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiExcludeEndpoint()
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
  @ApiExcludeEndpoint()
  logout(@Res() res: Response): void {
    res.clearCookie('auth_token');
    res.json({
      message: 'Usuario desautorizado',
    });
  }

  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.newPassword);
  }
}
