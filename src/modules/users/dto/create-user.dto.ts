import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../common/constants/roles.constant';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', minLength: 8 })
  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/\d/, { message: 'Password must contain at least one number' })
  @Matches(/[a-zA-Z]/, { message: 'Password must contain at least one letter' })
  password: string;

  @ApiProperty({ enum: Role, default: Role.USER })
  @IsEnum(Role)
  role: Role;
}