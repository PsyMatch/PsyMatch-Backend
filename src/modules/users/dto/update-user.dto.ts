import {
  IsOptional,
  IsString,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  Length,
  MinLength,
} from 'class-validator';
import { ERole } from '../enums/role.enum';
import { Psychologist } from '../../psychologist/entities/psychologist.entity';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string.' })
  @Length(3, 80, {
    message: 'Name must be between 3 and 80 characters.',
  })
  name?: string;

  @IsOptional()
  @IsString()
  profile_picture?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Phone must be a number.' })
  phone?: number;

  @IsOptional()
  @IsString({ message: 'Address must be a string.' })
  @Length(3, 80, {
    message: 'Address must be between 3 and 80 characters.',
  })
  address?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email must be valid.' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Password must be a string.' })
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  password?: string;

  @IsOptional()
  @IsEnum(ERole)
  role?: ERole;

  @IsOptional()
  @IsString({ message: 'Professionals ID must be a string.' })
  professionals?: Psychologist[];

  @IsOptional()
  @IsBoolean({ message: 'The value must be true or false.' })
  is_active?: boolean;
}
