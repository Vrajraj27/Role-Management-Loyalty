import { IsNumber, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from '@nestjs/class-validator';

export class ModulesMethodGet {
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  skip?: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;

  @Type(() => String)
  moduleName?: string;

  @Type(() => Boolean)
  isGlobally?: boolean;

  @Type(() => String)
  methodName?: string;

  @Type(() => String)
  organizationId?: string;
}

export class MethodDelete {
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;

  @Type(() => String)
  organizationId?: string;
}
