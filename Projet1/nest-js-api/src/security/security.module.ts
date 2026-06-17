import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigKey, configManager } from '../common/config';
import { Credential, Token } from './model';
import { TokenService } from './jwt/token.service';
import { SecurityController } from './security.controller';
import { SecurityService } from './security.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: configManager.getValue(ConfigKey.JWT_TOKEN_SECRET),
      signOptions: {
        expiresIn: configManager.getValue(ConfigKey.JWT_TOKEN_EXPIRE_IN) as any,
      },
    }),
    TypeOrmModule.forFeature([Credential, Token]),
  ],
  exports: [SecurityService],
  providers: [SecurityService, TokenService],
  controllers: [SecurityController],
})
export class SecurityModule {}
