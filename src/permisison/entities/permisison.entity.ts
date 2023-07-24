import { IsNumber, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';
import { IsMongoId, IsNotEmpty, IsString } from '@nestjs/class-validator';

export class PermisisonGet {
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  skip?: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsMongoId()
  @Type(() => mongoose.Types.ObjectId)
  roleId?: mongoose.Types.ObjectId;

  @Type(() => String)
  role?: String;

  @Type(() => String)
  name?: String;

  @Type(() => String)
  organizationId?: String;
}

export class PermissionCheckGet {
  @Type(() => String)
  roleName: String;

  @Type(() => String)
  organizationId: String;

  @Type(() => String)
  MethodName: String;

  @Type(() => String)
  moduleName?: String;
}

export class PermissionDelete {
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;

  @Type(() => String)
  organizationId: string;

  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  roleName: String;
}