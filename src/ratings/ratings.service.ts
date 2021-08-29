import { Injectable } from '@nestjs/common';
import { Book } from 'books/entities/book.entity';
import { User } from 'users/entities/user.entity';
import { Rating } from './entities/rating.entity';

@Injectable()
export class RatingsService {
  async rateBook(reqUser: User, id: string, rating: number) {
    try {
      const user = await User.findOneOrFail({
        where: { id: reqUser.id },
      });

      const book = await Book.findOneOrFail(id, {
        relations: ['user'],
      });

      if (rating <= 0 || rating > 5) throw new Error('Rating must be 1 to 5');

      const rated = await Rating.findOne({ where: { user, book } });
      if (rated) throw new Error('You already rated this book.');

      const rate = Rating.create({ user, book, point: rating });
      await rate.save();
      // ((Overall Rating * Total Rating) + new Rating) / (Total Rating + 1)

      const r = await Rating.find({ where: { book }, select: ['point'] });
      let total = 0;
      r.forEach((rating) => (total += rating.point));
      book.avgRating = total / r.length;

      await book.save();
      return await Book.findOneOrFail(id, {
        relations: ['user', 'rating'],
      });
    } catch (error) {
      return error;
    }
  }
}
