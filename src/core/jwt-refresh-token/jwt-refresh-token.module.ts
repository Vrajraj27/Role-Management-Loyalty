import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'refreshToken',
    }),
  ],
  providers: [
    {
      provide: 'JwtRefreshTokenService',
      useExisting: JwtService,
    },
  ],
  exports: ['JwtRefreshTokenService'],
})
export class JwtRefreshTokenModule {}
