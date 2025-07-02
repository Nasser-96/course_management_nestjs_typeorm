import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonController } from './lesson.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonRepository } from './repositories/lesson.repository';

@Module({
  imports: [TypeOrmModule.forFeature([LessonRepository])],
  controllers: [LessonController],
  providers: [LessonService],
})
export class LessonModule {}
