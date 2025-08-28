import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class BanUserDto {
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
