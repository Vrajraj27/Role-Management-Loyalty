import { Module } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { ModulesController } from './modules.controller';
import { SchemasModule } from 'src/schemas/schemas.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { PassportModule } from '@nestjs/passport';
import { CoreModule } from 'src/core/core/core.module';

@Module({
  imports: [SchemasModule, NestjsFormDataModule, PassportModule, CoreModule],
  controllers: [ModulesController],
  providers: [ModulesService],
})
export class ModulesModule {}
