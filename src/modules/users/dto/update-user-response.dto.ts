import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserResponseDto {
  @ApiPropertyOptional({ description: 'ID del usuario' })
  id?: string;

  @ApiPropertyOptional({ description: 'Nombre completo del usuario' })
  name?: string;

  @ApiPropertyOptional({ description: 'Alias del usuario' })
  alias?: string;

  @ApiPropertyOptional({ description: 'Imagen de perfil' })
  profile_picture?: string;

  @ApiPropertyOptional({ description: 'Número de teléfono' })
  phone?: string;

  @ApiPropertyOptional({ description: 'Fecha de nacimiento' })
  birthdate?: string;

  @ApiPropertyOptional({ description: 'Obra social' })
  health_insurance?: string;

  @ApiPropertyOptional({ description: 'Dirección' })
  address?: string;

  @ApiPropertyOptional({ description: 'Contacto de emergencia' })
  emergency_contact?: string;

  @ApiPropertyOptional({ description: 'Correo electrónico' })
  email?: string;

  @ApiPropertyOptional({ description: 'Latitud' })
  latitude?: number;

  @ApiPropertyOptional({ description: 'Longitud' })
  longitude?: number;

  @ApiPropertyOptional({ description: 'Contraseña (hash)' })
  password?: string;
}
