import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Builder } from 'builder-pattern';
import { Repository } from 'typeorm';
import { ConfigKey, configManager } from '../../common/config';
import { Credential, RefreshTokenPayload, Token } from '../model';
import {
  TokenExpiredException,
  TokenGenerationException,
} from '../security.exception';

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);

  constructor(
    @InjectRepository(Token) private readonly repository: Repository<Token>,
    @InjectRepository(Credential)
    private readonly credentialRepository: Repository<Credential>,
    private jwtService: JwtService,
  ) {}

  public async getTokens(credential: Credential): Promise<Token> {
    try {
      await this.repository.delete({ credential });
      const payload = { sub: credential.credential_id };
      const token = await this.jwtService.signAsync(payload, {
        secret: configManager.getValue(ConfigKey.JWT_TOKEN_SECRET),
        expiresIn: configManager.getValue(ConfigKey.JWT_TOKEN_EXPIRE_IN) as any,
      });
      const refreshToken = await this.jwtService.signAsync(payload, {
        secret: configManager.getValue(ConfigKey.JWT_REFRESH_TOKEN_SECRET),
        expiresIn: configManager.getValue(
          ConfigKey.JWT_REFRESH_TOKEN_EXPIRE_IN,
        ) as any,
      });

      return await this.repository.save(
        this.repository.create(
          Builder<Token>()
            .token(token)
            .refreshToken(refreshToken)
            .credential(credential)
            .build(),
        ),
      );
    } catch (e) {
      this.logger.error((e as Error).message);
      throw new TokenGenerationException();
    }
  }

  public async deleteFor(credential: Credential): Promise<void> {
    await this.repository.delete({ credential });
  }

  public async refresh(payload: RefreshTokenPayload): Promise<Token> {
    let id: string;

    try {
      id = this.jwtService.verify(payload.refresh, {
        secret: configManager.getValue(ConfigKey.JWT_REFRESH_TOKEN_SECRET),
      }).sub;
    } catch (e) {
      this.logger.error((e as Error).message);
      throw new TokenExpiredException();
    }

    const credential = await this.credentialRepository.findOneBy({
      credential_id: id,
    });

    if (!credential) {
      throw new TokenExpiredException();
    }

    return this.getTokens(credential);
  }
}
