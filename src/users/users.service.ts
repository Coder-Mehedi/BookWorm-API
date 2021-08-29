import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  async create(createUserInput: CreateUserInput) {
    const { name, email, password } = createUserInput;
    try {
      if (!name) throw new Error('Name is Required');
      if (!email) throw new Error('Email is Required');
      if (!password) throw new Error('Password is Required');

      const foundUser = await User.findOne({ email });
      if (foundUser) throw new Error('Account Already Exist!');

      const saltRounds = 10;
      const hash = await bcrypt.hash(password, saltRounds);
      const user = User.create({ ...createUserInput, password: hash });
      return await user.save();
    } catch (error) {
      return error;
    }
  }

  async findAll() {
    try {
      return await User.find({ relations: [] });
    } catch (error) {
      console.log(error);
    }
  }

  async findOne(id: string) {
    try {
      return await User.findOne({ id }, { relations: [] });
    } catch (error) {
      console.log(error);
    }
  }

  async findOneByEmail(email: string) {
    try {
      return await User.findOne({ email }, { relations: [] });
    } catch (error) {
      console.log(error);
    }
  }
}
