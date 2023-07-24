import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from '@nestjs/class-validator';
import { Type } from 'class-transformer';

class method {
  @IsString()
  @IsNotEmpty()
  method: string;

  @IsBoolean()
  @IsNotEmpty()
  permission: boolean;
}

export class CreateModulesMethodDto {
  @IsString()
  @IsOptional()
  organizationId: string;

  @IsArray()
  @IsOptional()
  moduleNameIn: [];

  @IsArray()
  @IsOptional()
  moduleNameNotIn: [];

  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @IsString()
  @IsNotEmpty()
  method: method[];
}
