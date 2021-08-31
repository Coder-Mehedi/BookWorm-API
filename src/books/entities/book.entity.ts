import { ObjectType, Field } from '@nestjs/graphql';
import { Rating } from 'ratings/entities/rating.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'users/entities/user.entity';

@ObjectType()
@Entity()
export class Book extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  author: string;

  @Field()
  @Column()
  publishedYear: string;

  @Field()
  @Column()
  category: string;

  @Field()
  @Column('decimal', { precision: 5, scale: 2, default: 0.0 })
  avgRating: number;

  @Field(() => [Rating], { nullable: true })
  @OneToMany(() => Rating, (rating) => rating.book)
  rating: Rating;

  @Field(() => User)
  @ManyToOne(() => User)
  user: User;
}

@ObjectType()
export class Info {
  @Field({ nullable: true })
  prev: string;

  @Field({ nullable: true })
  next: string;
}

@ObjectType()
export class BooksPayload {
  @Field()
  info: Info;

  @Field(() => [Book])
  results: Book[];
}
