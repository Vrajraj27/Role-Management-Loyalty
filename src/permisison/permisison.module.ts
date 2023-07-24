import { Module } from '@nestjs/common';
import { PermisisonService } from './permisison.service';
import { PermisisonController } from './permisison.controller';
import { SchemasModule } from 'src/schemas/schemas.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { PassportModule } from '@nestjs/passport';
import { CoreModule } from 'src/core/core/core.module';

@Module({
  imports: [SchemasModule, NestjsFormDataModule, PassportModule, CoreModule],
  controllers: [PermisisonController],
  providers: [PermisisonService],
})
export class PermisisonModule {}
