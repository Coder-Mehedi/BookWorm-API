import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Book } from 'books/entities/book.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'users/entities/user.entity';

@ObjectType()
@Entity()
export class Rating extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Int)
  @Column({ default: 0.0 })
  point: number;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Field(() => Book, { nullable: true })
  @ManyToOne(() => Book, { onDelete: 'CASCADE' })
  book: Book;
}
