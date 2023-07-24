import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'accessToken',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [
    {
      provide: 'JwtAccessTokenService',
      useExisting: JwtService,
    },
  ],
  exports: ['JwtAccessTokenService'],
})
export class JwtAccessTokenModule {}
