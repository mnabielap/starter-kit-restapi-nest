import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum TokenType {
  REFRESH = 'refresh',
  RESET_PASSWORD = 'resetPassword',
  VERIFY_EMAIL = 'verifyEmail',
}

@Entity('tokens')
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  token: string;

  @Column({
    type: 'simple-enum',
    enum: TokenType,
  })
  type: TokenType;

  @Column()
  expires: Date;

  @Column({ default: false })
  blacklisted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;
}