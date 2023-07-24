import { IsNumber, IsOptional, Min } from "@nestjs/class-validator";
import { Type } from "class-transformer";

export class Organization {
  @Type(() => String)
  organizationId: String;
}

export class organizationGet {
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  skip?: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;


  @Type(() => String)
  organizationId?: String;
}