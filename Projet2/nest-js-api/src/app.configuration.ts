import {
  INestApplication,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ApiInterceptor } from './common/api/api.interceptor';
import { ValidationException } from './common/api/api.exception';
import { ConfigKey, configManager } from './common/config';
import { swaggerConfiguration } from './common/documentation/swagger.configuration';

export const configureApp = (app: INestApplication): INestApplication => {
  app.setGlobalPrefix(configManager.getValue(ConfigKey.APP_BASE_URL));
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[] = []) =>
        new ValidationException(errors),
    }),
  );
  app.useGlobalInterceptors(new ApiInterceptor());
  swaggerConfiguration.config(app);

  return app;
};
