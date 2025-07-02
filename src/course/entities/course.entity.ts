import { RootEntity } from 'src/common/root.entity';
import { Lesson } from 'src/lesson/entities/lesson.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Course extends RootEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @ManyToOne(() => User, (user) => user.coursesTaught)
  instructor: User;

  @OneToMany(() => Lesson, (lesson) => lesson.course, { cascade: true })
  lessons: Lesson[];

  @ManyToMany(() => User, (user) => user.enrolledCourses)
  students: User[];
}
