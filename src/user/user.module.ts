import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    JwtModule.register({
      global: true,
      secret: process.env.JSON_TOKEN_KEY,
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [TypeOrmModule.forFeature([UserRepository])],
})
export class UserModule {}
