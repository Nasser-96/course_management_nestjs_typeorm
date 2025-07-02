import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from './enums/user-role';
import { User } from './entities/user.entity';
import { Profile } from 'src/profile/entities/profile.entity';
import { LoginDto } from './dto/login.dto';
import { CreateUserResponseDto } from './dto/create-user-response.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private jwtService: JwtService,
  ) {}
  async createUser(userData: CreateUserDto): Promise<CreateUserResponseDto> {
    const user = new User();
    const profile = new Profile();
    profile.bio = userData.bio || '';
    user.name = userData.name;
    user.password = userData.password;
    user.email = userData.email;
    user.role = userData.role || UserRole.STUDENT;
    user.profile = profile;

    const createdData = await this.userRepo.createUser(user);
    const token = await this.generateJWT(createdData);
    const userByEmail = await this.userRepo.getUserByEmail(userData.email);
    if (!userByEmail) {
      throw new Error('Cannot create user');
    }

    return {
      token,
      user_data: {
        id: userByEmail.id,
        name: userByEmail.name,
        email: userByEmail.email,
        role: userByEmail?.role,
        profile: userByEmail?.profile,
      },
    };
  }

  async enrollCourseService(
    token: string,
    courseId: string,
  ): Promise<{ message: string }> {
    const decodedData = this.jwtService.verify(token, {
      secret: process.env.JSON_TOKEN_KEY,
    });
    const userId = decodedData.id;

    const user = await this.userRepo.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const course = await this.userRepo.enrollCourse(user, courseId);
    if (!course) {
      throw new Error('Failed to enroll in course');
    }

    return { message: 'Enrolled in course successfully' };
  }

  async getEnrolledCoursesService(user: User) {
    const userWithCourses = await this.userRepo.getUserWithCourses(user.id);
    if (!userWithCourses) {
      throw new Error('User not found or no courses enrolled');
    }

    return {
      data: userWithCourses?.enrolledCourses,
    };
  }

  async loginUser(userData: LoginDto) {
    const user = await this.userRepo.getUserByEmail(userData.email);
    if (!user) {
      throw new Error('User not found');
    }
    const token = await this.generateJWT(user);

    return {
      token,
    };
  }

  async deleteUser(user: User) {
    await this.userRepo.deleteUser(user.id);

    return { message: 'User deleted successfully' };
  }

  private async generateJWT(userData: User): Promise<string> {
    const dataWithToken = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
    };

    const timeToExpire = 60 * 60 * 24 * 2; // 2 days
    return this.jwtService.signAsync(
      {
        ...dataWithToken,
      },
      { secret: process.env.JSON_TOKEN_KEY, expiresIn: `${timeToExpire}s` },
    );
  }
}
