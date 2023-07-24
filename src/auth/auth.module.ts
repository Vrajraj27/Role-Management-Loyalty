import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SchemasModule } from 'src/schemas/schemas.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccessTokenModule } from 'src/core/jwt-access-token/jwt-access-token.module';
import { JwtRefreshTokenModule } from 'src/core/jwt-refresh-token/jwt-refresh-token.module';
import { CoreModule } from 'src/core/core/core.module';

@Module({
  imports: [SchemasModule, NestjsFormDataModule, PassportModule, CoreModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
