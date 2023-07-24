import { Module } from '@nestjs/common';
import { JwtAccessTokenGuard } from 'src/common/guards/jwt-access-token/jwt-access-token.guard';
import { JwtRefreshGuard } from 'src/common/guards/jwt-refresh.guard';
import { JwtAccessTokenModule } from '../jwt-access-token/jwt-access-token.module';
import { JwtRefreshTokenModule } from '../jwt-refresh-token/jwt-refresh-token.module';

@Module({
  imports: [JwtAccessTokenModule, JwtRefreshTokenModule],
  providers: [JwtRefreshGuard, JwtAccessTokenGuard],
  exports: [
    JwtAccessTokenModule,
    JwtRefreshTokenModule,
    JwtAccessTokenGuard,
    JwtRefreshGuard,
  ],
})
export class CoreModule {}
