import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { User } from 'src/user/entities/user.entity';
import { UserRole } from 'src/user/enums/user-role';

@Injectable()
export class InstructorGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Please login first');
    }
    try {
      const payload: User = await this.jwtService.verifyAsync(token, {
        secret: process.env.JSON_TOKEN_KEY,
      });
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Invalid token, please login again');
    }

    if (request?.user?.role !== UserRole.INSTRUCTOR) {
      throw new UnauthorizedException(
        'You are not authorized to perform this action',
      );
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
