import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configManager } from './common/config';
import { SecurityModule } from './security/security.module';
import { JwtGuard } from './security/jwt/jwt.guard';
import { StudyModule } from './study/study.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configManager.getTypeOrmConfig()),
    StudyModule,
    SecurityModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule {}
