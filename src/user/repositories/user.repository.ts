import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Course } from 'src/course/entities/course.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(userData: User): Promise<User> {
    const foundUserByEmail = await this.getUserByEmail(userData.email);
    if (foundUserByEmail) {
      throw new ConflictException('User with this email already exists');
    }
    const savedData = await this.save(userData);
    await savedData.reload();
    return savedData;
  }

  async getUserById(id: string): Promise<User | undefined> {
    const qb = this.createQueryBuilder('user');
    const foundUser = await qb.where('user.id = :id', { id: id }).getOne();

    if (!foundUser) {
      throw new NotFoundException('User not found');
    }

    return foundUser;
  }

  async enrollCourse(user: User, courseId: string): Promise<User> {
    const qb = this.createQueryBuilder('user');
    const foundUser = await qb
      .leftJoinAndSelect('user.enrolledCourses', 'course')
      .where('user.id = :id', { id: user.id })
      .getOne();

    const existingEnrollment = await this.createQueryBuilder('user')
      .innerJoinAndSelect('user.enrolledCourses', 'course')
      .where('user.id = :id', { id: user.id })
      .andWhere('course.id = :courseId', { courseId })
      .getOne();

    if (!foundUser) {
      throw new NotFoundException('User not found');
    }

    if (existingEnrollment) {
      throw new ConflictException('User already enrolled in this course');
    }

    foundUser.enrolledCourses.push({ id: courseId } as Course);
    return await this.save(foundUser);
  }

  async getUserWithCourses(id: string): Promise<User | undefined> {
    const qb = this.createQueryBuilder('user');
    const foundUser = await qb
      .leftJoinAndSelect('user.enrolledCourses', 'course')
      .where('user.id = :id', { id: id })
      .getOne();

    if (!foundUser) {
      throw new NotFoundException('User not found');
    }

    return foundUser;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const qb = this.createQueryBuilder('user');
    const foundUserByEmail = await qb
      .leftJoinAndSelect('user.profile', 'profile')
      .where('user.email = :email', { email: email })
      .getOne();

    return foundUserByEmail;
  }

  async deleteUser(id: string): Promise<void> {
    const qb = this.createQueryBuilder('user');
    const foundUser = await qb
      .leftJoinAndSelect('user.profile', 'profile')
      .where('user.id = :id', { id })
      .getOne();

    if (!foundUser) {
      throw new NotFoundException('User not found');
    }
    await this.remove(foundUser);
  }
}
