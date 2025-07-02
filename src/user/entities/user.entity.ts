import { Course } from 'src/course/entities/course.entity';
import * as bcrypt from 'bcrypt';
import { Profile } from 'src/profile/entities/profile.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRole } from '../enums/user-role';
import { RootEntity } from 'src/common/root.entity';

@Entity()
export class User extends RootEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: true,
  })
  profile: Profile;

  @Column({ enum: UserRole, default: UserRole.STUDENT })
  role: UserRole;

  @OneToMany(() => Course, (course) => course.instructor)
  coursesTaught: Course[];

  @ManyToMany(() => Course, (course) => course.students)
  @JoinTable()
  enrolledCourses: Course[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      // Hash the password before saving to the database
      const saltRounds = 10;
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
  }
}
