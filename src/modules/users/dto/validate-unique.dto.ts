import {
  IsNotEmpty,
  IsEmail,
  IsString,
  IsNumber,
  ValidateIf,
  Matches,
} from 'class-validator';

export class ValidateDto {
  @IsNotEmpty({ message: 'El campo es obligatorio' })
  field: string;

  @ValidateIf((o: ValidateDto) => o.field === 'email')
  @IsEmail({}, { message: 'El email no es válido' })
  emailValue?: string;

  @ValidateIf((o: ValidateDto) => o.field === 'phone')
  @IsString({ message: 'El teléfono debe ser un string' })
  @Matches(/^\+?\d{8,15}$/, {
    message:
      'El teléfono debe ser un número válido (8 a 15 dígitos, puede iniciar con +).',
  })
  phoneValue?: string;

  @ValidateIf((o: ValidateDto) => o.field === 'dni')
  @IsNumber({}, { message: 'El DNI debe ser un número válido' })
  dniValue?: number;

  @ValidateIf((o: ValidateDto) => o.field === 'license_number')
  @IsNumber({}, { message: 'El número de matrícula debe ser un número válido' })
  licenseValue?: number;
}
