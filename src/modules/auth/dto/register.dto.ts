import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { Role } from '../../../common/constants/roles.constant';

export class RegisterDto extends CreateUserDto {
  @ApiPropertyOptional({ 
    enum: Role, 
    default: Role.USER, 
    description: 'Role is explicitly ignored and forced to USER by the server' 
  })
  @IsOptional()
  @IsEnum(Role)
  role: Role;
}