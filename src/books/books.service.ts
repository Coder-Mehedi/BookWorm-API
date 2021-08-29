import { Injectable } from '@nestjs/common';
import { User } from 'users/entities/user.entity';
import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';
import { Book } from './entities/book.entity';

@Injectable()
export class BooksService {
  async create(reqUser: User, createBookInput: CreateBookInput) {
    const user = await User.findOneOrFail({
      where: { id: reqUser.id },
    });
    try {
      const book = Book.create({ ...createBookInput, user });
      return await book.save();
    } catch (error) {}
  }

  async findAll() {
    try {
      return await Book.find({
        relations: ['user', 'rating', 'rating.book', 'rating.user'],
      });
    } catch (error) {}
  }
}
