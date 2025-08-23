import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendEmailChangePasswordDto {
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: '',
  })
  email: string;

  @IsString({ message: 'El token debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El token es obligatorio' })
  @ApiProperty({
    description: 'Token de restablecimiento de contraseña',
    example: '',
  })
  token: string;
}
