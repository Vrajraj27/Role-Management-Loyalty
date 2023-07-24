import { IsNumber, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString } from '@nestjs/class-validator';

export class ModuleGet {
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  skip?: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;

  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  isGlobally?: boolean;

  @Type(() => String)
  name?: string;

  @Type(() => String)
  organizationId?: string;
}

export class ModuleDelete {
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;

  @Type(() => String)
  organizationId?: string;
}
