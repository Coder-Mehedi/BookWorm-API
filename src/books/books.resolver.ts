import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { BooksService } from './books.service';
import { Book } from './entities/book.entity';
import { CreateBookInput } from './dto/create-book.input';
import { Authorize } from 'auth/user.guard';
import { User } from 'users/entities/user.entity';
import { CurrentUser } from 'shared/current-user.decorator';

@Resolver(() => Book)
export class BooksResolver {
  constructor(private readonly booksService: BooksService) {}

  @Authorize()
  @Mutation(() => Book)
  createBook(
    @CurrentUser() reqUser: User,
    @Args('createBookInput') createBookInput: CreateBookInput,
  ) {
    return this.booksService.create(reqUser, createBookInput);
  }

  @Query(() => [Book], { name: 'books' })
  findAll() {
    return this.booksService.findAll();
  }
}
