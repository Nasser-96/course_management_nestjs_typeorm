import { Body, Controller, Param, Post } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { BindEntityPipe } from 'src/common/pipes/bind-entity.pipe';
import { Course } from 'src/course/entities/course.entity';

@Controller('lesson')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  // id is the course ID
  @Post('create/:id')
  async createLesson(
    @Body() lessonData: CreateLessonDto,
    @Param('id', BindEntityPipe) course: Course,
  ) {
    // Logic to create a lesson will go here
    return await this.lessonService.createLessonService(lessonData, course);
  }
}
