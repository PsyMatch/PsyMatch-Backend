import {
  IsOptional,
  IsString,
  IsBoolean,
  IsEmail,
  IsEnum,
} from 'class-validator';
import { ERole } from '../enums/role.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  profile_picture?: string;

  @IsOptional()
  phone?: number;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(ERole)
  role?: ERole;

  @IsOptional()
  @IsString()
  professionals?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  last_login?: Date;
}
