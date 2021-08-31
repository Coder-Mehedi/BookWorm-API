import { Injectable } from '@nestjs/common';
import { User } from 'users/entities/user.entity';
import { CreateBookInput } from './dto/create-book.input';
import { Book } from './entities/book.entity';
import { buildPaginator } from 'typeorm-cursor-pagination';
import { getConnection } from 'typeorm';
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
      const queryBuilder = getConnection()
        .getRepository(Book)
        .createQueryBuilder('book')
        .leftJoinAndSelect('book.user', 'user')
        .leftJoinAndSelect('book.rating', 'rating')
        .leftJoinAndSelect('rating.user', 'rating.user');

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
        info: {
          next: cursor.afterCursor,
          prev: cursor.beforeCursor,
          total: bookCount,
        },
        results: data,
      };
    } catch (error) {
      return error;
    }
  }
}
