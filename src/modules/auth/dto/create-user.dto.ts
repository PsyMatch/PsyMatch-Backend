import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator';
import { ERole } from '../../users/enums/role.enum';

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

  @IsNotEmpty()
  @IsString()
  password: string;

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
