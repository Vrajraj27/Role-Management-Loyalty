import { PartialType } from '@nestjs/swagger';
import { CreateModulesMethodDto } from './create-modules-method.dto';

export class UpdateModulesMethodDto extends PartialType(CreateModulesMethodDto) {}
