import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigKey, configManager } from './common/config';
import { configureApp } from './app.configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureApp(app);
  await app.listen(configManager.getValue(ConfigKey.APP_PORT));
}
void bootstrap();
