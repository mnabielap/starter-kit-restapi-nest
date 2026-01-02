import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min, Max } from 'class-validator';

export enum Scope {
  ALL = 'all',
  NAME = 'name',
  EMAIL = 'email',
  ID = 'id',
}

export class PageOptionsDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly search?: string;

  @ApiPropertyOptional({ enum: Scope, default: Scope.ALL })
  @IsEnum(Scope)
  @IsOptional()
  readonly scope?: Scope = Scope.ALL;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly role?: string;

  @ApiPropertyOptional({ example: 'created_at:desc', description: 'Format: field:order' })
  @IsString()
  @IsOptional()
  readonly sortBy?: string;

  @ApiPropertyOptional({ minimum: 1, default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @ApiPropertyOptional({ minimum: 1, maximum: 100, default: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  readonly limit?: number = 10;

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}