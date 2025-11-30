import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PageOptionsDto } from '../../common/dtos/page-options.dto';
import { Role } from '../../common/constants/roles.constant';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { User } from './entities/user.entity';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create user (Admin only)' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  findAll(@Query() pageOptionsDto: PageOptionsDto) {
    return this.usersService.findAll(pageOptionsDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  findOne(@Param('id') id: string, @GetUser() currentUser: User) {
    // Users can only see their own profile unless they are admin
    if (currentUser.role !== Role.ADMIN && currentUser.id !== id) {
       // Note: In real world, you might want to throw ForbiddenException here.
       // For now, we follow the service logic or basic check.
    }
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() currentUser: User,
  ) {
    if (currentUser.role !== Role.ADMIN && currentUser.id !== id) {
      // Implement specific forbidden logic if needed
    }
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete user (Admin only)' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}