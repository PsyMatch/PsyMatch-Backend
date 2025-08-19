import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'tu@email.com',
  })
  @IsEmail(
    {},
    { message: 'El correo electrónico debe tener un formato válido.' },
  )
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
  email: string;

  @ApiProperty({
    description:
      'Contraseña del usuario (debe contener al menos una minúscula, una mayúscula y un número; el carácter especial es opcional)',
    example: 'MiContraseña123!',
    minLength: 6,
    maxLength: 100,
  })
  @IsString({ message: 'La contraseña debe ser un string.' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
  @Matches(/^(?=.*\p{Lu})(?=.*\p{Ll})(?=.*\d).{6,100}$/u, {
    message:
      'La contraseña debe contener al menos una minúscula, una mayúscula y un número. El carácter especial es opcional.',
  })
  @Length(6, 100, {
    message: 'La contraseña debe tener entre 6 y 100 caracteres.',
  })
  password: string;
}
