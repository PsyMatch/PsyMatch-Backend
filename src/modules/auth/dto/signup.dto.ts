import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  Matches,
  Length,
  Validate,
} from 'class-validator';
import { Psychologist } from '../../psychologist/entities/psychologist.entity';
import { MatchPasswordHelper } from 'src/modules/utils/helpers/matchPassword.helper';

export class SignUpDto {
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

  @Validate(MatchPasswordHelper, ['password'])
  confirmPassword: string;

  @IsOptional()
  @IsString()
  professionals?: Psychologist[];

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
