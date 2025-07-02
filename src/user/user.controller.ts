import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { BindEntityPipe } from 'src/common/pipes/bind-entity.pipe';
import { User } from './entities/user.entity';
import { CreateUserResponseDto } from './dto/create-user-response.dto';
import { StudentGuard } from './guards/student.guard';
import { Course } from 'src/course/entities/course.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async createUser(
    @Body() userData: CreateUserDto,
  ): Promise<CreateUserResponseDto> {
    return this.userService.createUser(userData);
  }

  // id is the course ID
  @UseGuards(StudentGuard)
  @Post('enrolled-courses/:id')
  async enrollCourse(
    @Headers('authorization') token: string,
    @Param('id', BindEntityPipe) course: Course,
  ) {
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length).trimLeft();
    }
    return this.userService.enrollCourseService(token, course.id);
  }

  // id is the user ID
  @Get('enrolled-courses/:id')
  async getEnrolledCourses(@Param('id', BindEntityPipe) user: User) {
    return this.userService.getEnrolledCoursesService(user);
  }

  @Post('login')
  async loginUser(@Body() userData: LoginDto) {
    return this.userService.loginUser(userData);
  }

  @Delete(':id')
  async deleteUser(@Param('id', BindEntityPipe) user: User) {
    return await this.userService.deleteUser(user);
  }
}
