import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SchemasModule } from './schemas/schemas.module';
import { AuthModule } from './auth/auth.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { JwtAccessTokenModule } from './core/jwt-access-token/jwt-access-token.module';
import { JwtRefreshTokenModule } from './core/jwt-refresh-token/jwt-refresh-token.module';
import { RoleModule } from './role/role.module';
import { PermisisonModule } from './permisison/permisison.module';
import { OrganizationModule } from './organization/organization.module';
import { ModulesModule } from './modules/modules.module';
import { ModulesMethodsModule } from './modules-methods/modules-methods.module';
require("dotenv").config();

const envFilePath: string = "../common/envs/.env"
const config = new ConfigService();

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI
    ),
    SchemasModule,
    UserModule,
    AuthModule,
    NestjsFormDataModule,
    JwtAccessTokenModule,
    JwtRefreshTokenModule,
    RoleModule,
    PermisisonModule,
    OrganizationModule,
    ModulesModule,
    ModulesMethodsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
