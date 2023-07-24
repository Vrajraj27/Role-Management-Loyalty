import { Module } from '@nestjs/common';
import { ModulesMethodsService } from './modules-methods.service';
import { ModulesMethodsController } from './modules-methods.controller';
import { SchemasModule } from 'src/schemas/schemas.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { PassportModule } from '@nestjs/passport';
import { CoreModule } from 'src/core/core/core.module';

@Module({
  imports: [SchemasModule, NestjsFormDataModule, PassportModule, CoreModule],
  controllers: [ModulesMethodsController],
  providers: [ModulesMethodsService],
})
export class ModulesMethodsModule {}
