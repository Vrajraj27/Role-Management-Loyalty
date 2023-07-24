import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  ValidateIf,
  ValidateNested,
} from '@nestjs/class-validator';
import { Type } from 'class-transformer';
class permission {
  @IsString()
  @IsNotEmpty()
  method: string;

  @IsBoolean()
  @IsNotEmpty()
  methodPermission: boolean;
}

export class CreatePermisisonDto {
  @IsString()
  @IsNotEmpty()
  organizationId: string;

  @IsString()
  @IsNotEmpty()
  roleName: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => !o.moduleName)
  name: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => !o.name)
  moduleName?: string;

  @Type(() => permission)
  @ValidateNested({ each: true })
  permissions: permission[];
}
