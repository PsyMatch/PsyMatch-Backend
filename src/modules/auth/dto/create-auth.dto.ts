import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  Matches,
  Length,
  Validate,
} from 'class-validator';
import { ERole } from '../../users/enums/role.enum';
import { MatchPassword } from '../helpers/matchpassword';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  profile_picture?: string;

  @IsOptional()
  phone?: number;

  @IsOptional()
  @IsString()
  address?: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/, {
    message:
      'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
  })
  @Length(8, 100, {
    message: 'The length of the password must be  between 8 and 100 characters',
  })
  password: string;

  @Validate(MatchPassword, ['password'])
  confirmPassword: string;

  @IsNotEmpty()
  @IsEnum(ERole)
  role: ERole;

  @IsOptional()
  @IsString()
  professionals?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
