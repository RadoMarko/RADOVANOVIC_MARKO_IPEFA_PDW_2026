import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Builder } from 'builder-pattern';
import { isNil } from 'lodash';
import { Repository } from 'typeorm';
import {
  Credential,
  RefreshTokenPayload,
  SignInPayload,
  SignupPayload,
  Token,
} from './model';
import {
  CredentialDeleteException,
  SignupException,
  UserAlreadyExistException,
  UserNotFoundException,
} from './security.exception';
import { TokenService } from './jwt/token.service';
import { comparePassword, encryptPassword } from './utils/password.decoder';

@Injectable()
export class SecurityService {
  private readonly logger = new Logger(SecurityService.name);

  constructor(
    @InjectRepository(Credential)
    private readonly repository: Repository<Credential>,
    private readonly tokenService: TokenService,
  ) {}

  public async detail(id: string): Promise<Credential> {
    const result = await this.repository.findOneBy({ credential_id: id });

    if (!isNil(result)) {
      return result;
    }

    throw new UserNotFoundException();
  }

  public async signIn(
    payload: SignInPayload,
    isAdmin: boolean,
  ): Promise<Token> {
    let result: Credential | null = null;

    if (payload.socialLogin) {
      if (!isNil(payload.facebookHash) && payload.facebookHash.length > 0) {
        result = await this.repository.findOneBy({
          facebookHash: payload.facebookHash,
          isAdmin,
        });
      } else if (!isNil(payload.googleHash) && payload.googleHash.length > 0) {
        result = await this.repository.findOneBy({
          googleHash: payload.googleHash,
          isAdmin,
        });
      }
    } else {
      result = await this.repository.findOneBy({
        username: payload.username,
        isAdmin,
      });
    }

    if (isNil(result)) {
      throw new UserNotFoundException();
    }

    if (
      payload.socialLogin ||
      (await comparePassword(payload.password, result.password))
    ) {
      return this.tokenService.getTokens(result);
    }

    throw new UserNotFoundException();
  }

  public async signup(payload: SignupPayload): Promise<Token> {
    const result: Credential | null = await this.repository.findOneBy({
      username: payload.username,
    });

    if (!isNil(result)) {
      throw new UserAlreadyExistException();
    }

    try {
      const hasSocialLogin =
        (!isNil(payload.facebookHash) && payload.facebookHash.length > 0) ||
        (!isNil(payload.googleHash) && payload.googleHash.length > 0);
      const encryptedPassword = hasSocialLogin
        ? ''
        : await encryptPassword(payload.password);

      await this.repository.save(
        this.repository.create(
          Builder<Credential>()
            .username(payload.username)
            .password(encryptedPassword)
            .facebookHash(payload.facebookHash ?? '')
            .googleHash(payload.googleHash ?? '')
            .mail(payload.mail)
            .build(),
        ),
      );

      const signInPayload: SignInPayload = {
        ...payload,
        socialLogin: hasSocialLogin,
      };

      return this.signIn(signInPayload, false);
    } catch (e) {
      this.logger.error((e as Error).message);
      throw new SignupException();
    }
  }

  public async refresh(payload: RefreshTokenPayload): Promise<Token> {
    return this.tokenService.refresh(payload);
  }

  public async delete(id: string): Promise<void> {
    try {
      const detail = await this.detail(id);
      await this.tokenService.deleteFor(detail);
      await this.repository.remove(detail);
    } catch (e) {
      this.logger.error((e as Error).message);
      throw new CredentialDeleteException();
    }
  }
}
