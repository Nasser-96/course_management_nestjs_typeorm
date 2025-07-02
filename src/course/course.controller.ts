import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { InstructorGuard } from './guards/instructor.guard';
import { CreateCourseDto } from './dto/create-course.dto';
import { BindEntityPipe } from 'src/common/pipes/bind-entity.pipe';
import { User } from 'src/user/entities/user.entity';
import {
  IQueryParams,
  QueryParamOptions,
} from 'src/common/decorateros/query-params-options';
import { Course } from './entities/course.entity';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @UseGuards(InstructorGuard)
  @Post('create')
  async createCourse(
    @Body() course: CreateCourseDto,
    @Headers('authorization') token: string,
  ) {
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length).trimLeft();
    }
    return this.courseService.createCourse(course, token);
  }

  // the id is the course id
  @Get('lessons/:id')
  async getCourseWithLesson(@Param('id', BindEntityPipe) course: Course) {
    return await this.courseService.getCourseWithLessonService(course.id);
  }

  // the id is the course id
  @Get('students/:id')
  async getCourseWithStudents(@Param('id', BindEntityPipe) course: Course) {
    return await this.courseService.getCourseWithStudentsService(course.id);
  }

  @Get('courses')
  async getCourses(@QueryParamOptions() queryParams: IQueryParams) {
    return this.courseService.getCourses(queryParams);
  }

  @Get('courses/:id')
  async getInstructorCourses(
    @Param('id', BindEntityPipe) user: User,
    @QueryParamOptions() queryParams: IQueryParams,
  ) {
    return this.courseService.getInstructorCourses(user.id, queryParams);
  }
}
