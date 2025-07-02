import { Profile } from 'src/profile/entities/profile.entity';
import { UserRole } from '../enums/user-role';

export class CreateUserResponseDto {
  token: string; // Optional token for authentication
  user_data: {
    id: string;
    name: string;
    email: string;
    role?: UserRole; // Assuming role is a string, adjust if it's an enum
    profile?: Profile;
  };

  //   constructor(partial: Partial<CreateUserResponseDto>) {
  //     Object.assign(this, partial);
  //   }
}
