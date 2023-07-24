import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { SchemasModule } from 'src/schemas/schemas.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { APP_GUARD } from '@nestjs/core';
import { JwtAccessTokenGuard } from 'src/common/guards/jwt-access-token/jwt-access-token.guard';
import { PassportModule } from '@nestjs/passport';
import { JwtAccessTokenModule } from 'src/core/jwt-access-token/jwt-access-token.module';
import { JwtRefreshTokenModule } from 'src/core/jwt-refresh-token/jwt-refresh-token.module';
import { JwtRefreshGuard } from 'src/common/guards/jwt-refresh.guard';
import { CoreModule } from 'src/core/core/core.module';

@Module({
  imports: [
    SchemasModule,
    NestjsFormDataModule,
    PassportModule,
    CoreModule,
  ],
  controllers: [RoleController],
  providers: [
    RoleService,
  ],
})
export class RoleModule {}
