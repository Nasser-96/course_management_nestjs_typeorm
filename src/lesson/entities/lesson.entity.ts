import { RootEntity } from 'src/common/root.entity';
import { Course } from 'src/course/entities/course.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Lesson extends RootEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @ManyToOne(() => Course, (course) => course.lessons)
  course: Course;
}
