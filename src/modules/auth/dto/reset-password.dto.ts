import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  token: string;

  @ApiProperty({ example: 'newPassword123' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/\d/)
  @Matches(/[a-zA-Z]/)
  password: string;
}