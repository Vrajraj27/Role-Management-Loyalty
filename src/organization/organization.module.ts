import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { SchemasModule } from 'src/schemas/schemas.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { PassportModule } from '@nestjs/passport';
import { CoreModule } from 'src/core/core/core.module';

@Module({
  imports: [SchemasModule, NestjsFormDataModule, PassportModule, CoreModule],
  controllers: [OrganizationController],
  providers: [OrganizationService],
})
export class OrganizationModule {}
