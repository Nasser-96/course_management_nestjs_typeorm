import { EntityRepository, Repository } from 'typeorm';
import { Course } from '../entities/course.entity';
import { IQueryParams } from 'src/common/decorateros/query-params-options';
import { NotFoundException } from '@nestjs/common';

@EntityRepository(Course)
export class CourseRepository extends Repository<Course> {
  async createCourse(
    courseData: Course,
    instructorId: string,
  ): Promise<Course> {
    const course = await this.save({
      ...courseData,
      instructor: { id: instructorId },
    });

    const insertedId = course.id;

    const courseWithInstructor = (await this.createQueryBuilder('course')
      .leftJoinAndSelect('course.instructor', 'instructor')
      .where('course.id = :id', { id: insertedId })
      .getOne()) as Course;

    return courseWithInstructor;
  }

  async getCourses(queryParams: IQueryParams) {
    const limit = (queryParams.limit as number) || 10;
    const page = (queryParams.page as number) || 1;
    const [data, total] = await this.createQueryBuilder('course')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async getInstructorCourses(
    instructorId: string,
    queryParams: IQueryParams,
  ): Promise<{ data: Course[]; total: number; page: number; limit: number }> {
    const limit = (queryParams.limit as number) || 10;
    const page = (queryParams.page as number) || 1;
    const [data, total] = await this.createQueryBuilder('course')
      .where('course.instructor.id = :instructorId', { instructorId })
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async getCourseWithStudents(courseId: string): Promise<Course> {
    const courseWithStudents = await this.createQueryBuilder('course')
      .leftJoin('course.students', 'student')
      .where('course.id = :id', { id: courseId })
      .select(['student.id', 'student.name', 'student.email', 'course'])
      .getOne();

    if (!courseWithStudents) {
      throw new NotFoundException('Course not found');
    }

    return courseWithStudents;
  }

  async getCourseWithLesson(courseId: string): Promise<Course> {
    const courseWithLesson = await this.createQueryBuilder('course')
      .leftJoinAndSelect('course.lessons', 'lesson')
      .where('course.id = :id', { id: courseId })
      .getOne();

    if (!courseWithLesson) {
      throw new Error('Course not found');
    }

    return courseWithLesson;
  }
}
