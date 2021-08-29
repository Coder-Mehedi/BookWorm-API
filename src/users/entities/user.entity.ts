import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { Book } from 'books/entities/book.entity';

import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum UserRole {
  Admin = 'admin',
  User = 'user',
}
registerEnumType(UserRole, { name: 'UserRole' });

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field()
  @Column({ unique: true })
  password: string;

  @Field(() => UserRole, { nullable: true })
  @Column({ type: 'enum', enum: UserRole, default: UserRole.User })
  role: UserRole;

  @Field()
  @Column({ default: true })
  isActive: boolean;

  @Field(() => [Book], { nullable: true })
  @OneToMany(() => Book, (post) => post.user)
  posts: Book[];
}
