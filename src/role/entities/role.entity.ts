import { IsNumber, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from '@nestjs/class-validator';

export class RoleGet {
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  skip?: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;

  @Type(() => String)
  name?: string;

  @Type(() => String)
  organizationId?: string;
}

export class RoleDelete {
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;

  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  organizationId: string;
}
