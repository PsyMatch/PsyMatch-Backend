import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SendBannedEmailDto {
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  @ApiProperty({
    description: 'Correo electrónico del usuario baneado',
    example: 'usuario@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Motivo del baneo del usuario',
    example: 'Violación de términos de servicio',
    required: true,
    maxLength: 500,
  })
  @IsNotEmpty({ message: 'El motivo del baneo es obligatorio' })
  @IsString()
  @MaxLength(500, { message: 'El motivo no puede exceder los 500 caracteres' })
  reason: string;
}
