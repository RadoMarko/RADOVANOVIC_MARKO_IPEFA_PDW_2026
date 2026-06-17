import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { isNil } from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigKey, configManager } from '../config';
import { ApiCodeResponse } from './api-code-response.enum';

@Injectable()
export class ApiInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ApiInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const path = ctx.getRequest().route.path;

    return next.handle().pipe(
      map((response: any) => ({
        code: this.map(path),
        data: instanceToPlain(response),
        result: true,
      })),
    );
  }

  private map(path: string): ApiCodeResponse {
    this.logger.log(`path ${path}`);
    const part = path
      .replace(configManager.getValue(ConfigKey.APP_BASE_URL), '')
      .split('/')
      .filter((s) => s.length > 0)
      .slice(0, 2)
      .map((s) => s.replace(/-/g, '_').toUpperCase());
    const code =
      ApiCodeResponse[
        `${part.join('_')}_SUCCESS` as keyof typeof ApiCodeResponse
      ];

    return isNil(code) ? ApiCodeResponse.COMMON_SUCCESS : code;
  }
}
