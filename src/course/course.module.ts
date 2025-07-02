import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseRepository } from './repositories/course.repository';
import { UserRepository } from 'src/user/repositories/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([CourseRepository]),
    TypeOrmModule.forFeature([UserRepository]),
  ],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
