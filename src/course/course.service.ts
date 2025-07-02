import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { JwtService } from '@nestjs/jwt';
import { CourseRepository } from './repositories/course.repository';
import { Course } from './entities/course.entity';
import { User } from 'src/user/entities/user.entity';
import { IQueryParams } from 'src/common/decorateros/query-params-options';

@Injectable()
export class CourseService {
  constructor(
    private jwtService: JwtService,
    private readonly courseRepository: CourseRepository,
  ) {}
  async createCourse(courseDto: CreateCourseDto, token: string) {
    const decodedData = this.jwtService.verify(token, {
      secret: process.env.JSON_TOKEN_KEY,
    });
    const instructorId = decodedData.id;

    const course = new Course();
    course.title = courseDto.title;
    course.instructor = { id: decodedData.id } as User;

    const newCourse = await this.courseRepository.createCourse(
      course,
      instructorId,
    );

    const returnCourse = {
      id: newCourse.id,
      title: newCourse.title,
      instructor: {
        id: newCourse.instructor.id,
        name: newCourse.instructor.name,
        email: newCourse.instructor.email,
      },
    };
    return { message: 'Course created successfully', course: returnCourse };
  }

  async getCourses(queryParams: IQueryParams) {
    const { data, limit, page, total } =
      await this.courseRepository.getCourses(queryParams);

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async getCourseWithLessonService(courseId: string) {
    const courseWithLesson =
      await this.courseRepository?.getCourseWithLesson(courseId);

    return {
      data: courseWithLesson,
    };
  }

  async getCourseWithStudentsService(courseId: string) {
    const courseWithStudents =
      await this.courseRepository.getCourseWithStudents(courseId);

    return {
      data: courseWithStudents,
    };
  }

  async getInstructorCourses(instructorId: string, queryParams: IQueryParams) {
    const { data, limit, page, total } =
      await this.courseRepository.getInstructorCourses(
        instructorId,
        queryParams,
      );

    return {
      data,
      total,
      page,
      limit,
    };
  }
}
