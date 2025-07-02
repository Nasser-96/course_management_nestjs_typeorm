import { EntityRepository, Repository } from 'typeorm';
import { Lesson } from '../entities/lesson.entity';

@EntityRepository(Lesson)
export class LessonRepository extends Repository<Lesson> {
  async createLessonWithCourse(lessonData: Lesson): Promise<Lesson> {
    const lesson = await this.save(lessonData);

    const insertedId = lesson.id;

    const lessonWithCourse = (await this.createQueryBuilder('lesson')
      .leftJoinAndSelect('lesson.course', 'course')
      .where('lesson.id = :id', { id: insertedId })
      .getOne()) as Lesson;

    return lessonWithCourse;
  }
}
