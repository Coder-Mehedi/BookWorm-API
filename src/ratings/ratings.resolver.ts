import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { RatingsService } from './ratings.service';
import { Rating } from './entities/rating.entity';
import { Authorize } from 'auth/user.guard';
import { Book } from 'books/entities/book.entity';
import { CurrentUser } from 'shared/current-user.decorator';
import { User } from 'users/entities/user.entity';

@Resolver(() => Rating)
export class RatingsResolver {
  constructor(private readonly ratingsService: RatingsService) {}

  @Authorize()
  @Mutation(() => Book)
  rateBook(
    @CurrentUser() reqUser: User,
    @Args('id') id: string,
    @Args('rating') rating: number,
  ) {
    return this.ratingsService.rateBook(reqUser, id, rating);
  }
}
