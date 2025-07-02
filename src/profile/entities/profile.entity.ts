import { RootEntity } from 'src/common/root.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Profile extends RootEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  bio: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
