import { Injectable } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { Course } from 'src/course/entities/course.entity';
import { LessonRepository } from './repositories/lesson.repository';
import { Lesson } from './entities/lesson.entity';

@Injectable()
export class LessonService {
  constructor(private readonly lessonRepo: LessonRepository) {}
  // This service will contain methods to handle lesson-related logic
  async createLessonService(lessonData: CreateLessonDto, course: Course) {
    const lesson = new Lesson();
    lesson.title = lessonData.title;
    lesson.course = course;
    const newLesson = await this.lessonRepo.createLessonWithCourse(lesson);

    return {
      message: 'Lesson created successfully',
      lesson: {
        id: newLesson.id,
        title: newLesson.title,
        course: {
          id: newLesson.course.id,
          title: newLesson.course.title,
        },
      },
    };
  }
}
