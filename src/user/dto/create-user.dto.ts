import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { UserRole } from '../enums/user-role';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString({ message: 'Name must be a string' })
  name: string;

  @IsNotEmpty()
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsNotEmpty()
  @IsString()
  @Length(8)
  password: string;

  @IsOptional()
  @IsString()
  bio?: string;
}
