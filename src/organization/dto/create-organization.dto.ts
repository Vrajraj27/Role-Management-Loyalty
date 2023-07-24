import { IsNotEmpty, IsString } from "@nestjs/class-validator";

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  organizationId: string;
}
