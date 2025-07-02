import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Course } from 'src/course/entities/course.entity';
import { Lesson } from 'src/lesson/entities/lesson.entity';
import { Profile } from 'src/profile/entities/profile.entity';
import { User } from 'src/user/entities/user.entity';

export default (): TypeOrmModuleOptions => {
  const isTsNode = process.env.TS_NODE === 'true';

  return {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT
      ? parseInt(process.env.DATABASE_PORT)
      : 5444,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [User, Profile, Lesson, Course],
    synchronize: false, // Set to false in production
    migrations: [isTsNode ? 'src/migrations/*.ts' : 'dist/migrations/*.js'],
    cli: {
      migrationsDir: 'src/migrations',
    },
  };
};
