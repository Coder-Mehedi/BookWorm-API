import { Injectable } from '@nestjs/common';
import { User } from 'users/entities/user.entity';
import { CreateBookInput } from './dto/create-book.input';
import { Book } from './entities/book.entity';
import { buildPaginator } from 'typeorm-cursor-pagination';
import { getConnection } from 'typeorm';
import { Rating } from 'ratings/entities/rating.entity';
interface PagingResult<Entity> {
  data: Entity[];
  cursor: Cursor;
}

interface Cursor {
  beforeCursor: string | null;
  afterCursor: string | null;
}
@Injectable()
export class BooksService {
  async create(reqUser: User, createBookInput: CreateBookInput) {
    const user = await User.findOneOrFail({
      where: { id: reqUser.id },
    });
    try {
      const book = Book.create({ ...createBookInput, user });
      return await book.save();
    } catch (error) {
      return error;
    }
  }

  async findAll(limit = 10, next: string, prev: string) {
    try {
      const bookCount = await Book.count();
      const queryBuilder = Book.createQueryBuilder('book')
        .leftJoinAndSelect('book.user', 'user')
        .leftJoinAndSelect('book.rating', 'rating')
        .leftJoinAndSelect('rating.user', 'rating.user');

      const avgRatingPoint = await Rating.createQueryBuilder('rating')
        .select('rating.bookId', 'bookId')
        .addSelect('AVG(rating.point)', 'point')
        .groupBy('rating.bookId')
        .getRawMany();

      const paginator = buildPaginator({
        entity: Book,
        paginationKeys: ['id'],
        query: {
          limit,
          order: 'ASC',
          afterCursor: next,
          beforeCursor: prev,
        },
      });

      const { data, cursor } = await paginator.paginate(queryBuilder);

      return {
        pageInfo: {
          hasNextPage: !!cursor.afterCursor,
          hasPreviousPage: !!cursor.beforeCursor,
          total: bookCount,
          next: cursor.afterCursor,
          prev: cursor.beforeCursor,
        },
        edges: data.map((book) => {
          const found = avgRatingPoint.find((e) => e.bookId === book.id);
          if (found) book.avgRating = found.point;
          return {
            cursor: cursor.afterCursor,
            node: book,
          };
        }),
      };
    } catch (error) {
      return error;
    }
  }
}
