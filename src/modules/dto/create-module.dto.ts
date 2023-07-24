import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateModuleDto {
  @ApiProperty({ example: 'module name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  organizationId: string;
}
