import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudyController } from './controller';
import { Study } from './model';
import { StudyService } from './service';

@Module({
  imports: [TypeOrmModule.forFeature([Study])],
  controllers: [StudyController],
  providers: [StudyService],
})
export class StudyModule {}
