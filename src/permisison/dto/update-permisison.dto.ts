import { PartialType } from '@nestjs/mapped-types';
import { CreatePermisisonDto } from './create-permisison.dto';

export class UpdatePermisisonDto extends PartialType(CreatePermisisonDto) {}
