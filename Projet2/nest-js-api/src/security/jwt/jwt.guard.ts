import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { isNil } from 'lodash';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IS_PUBLIC_KEY } from '../../common/config';
import { Credential } from '../model';
import { SecurityService } from '../security.service';
import {
  NoTokenFoundedException,
  TokenExpiredException,
} from '../security.exception';

@Injectable()
export class JwtGuard implements CanActivate {
  private readonly logger = new Logger(JwtGuard.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly securityService: SecurityService,
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    return isPublic
      ? true
      : this.validateToken(context.switchToHttp().getRequest());
  }

  private validateToken(request: any): Observable<boolean> {
    if (!isNil(request.headers.authorization)) {
      try {
        const id = this.jwtService.verify(
          request.headers.authorization.replace('Bearer ', ''),
        ).sub;

        return from(this.securityService.detail(id)).pipe(
          map((user: Credential) => {
            request.user = user;
            return true;
          }),
        );
      } catch (e) {
        this.logger.log((e as Error).message);
        throw new TokenExpiredException();
      }
    }

    throw new NoTokenFoundedException();
  }
}
