import { Injectable } from '@nestjs/common';
import { usersMock } from './mock/users.mock';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor() {}

  async findAll() {
    return usersMock;
  }
  async findById(id: string) {
    return usersMock.find((user) => user.id === id);
  }

  async findByEmail(email: string) {
    return usersMock.find((user) => user.email === email);
  }

  async create(user: CreateUserDto) {
    const payload = {
      email: user.email,
      role: user.role,
      password: bcrypt.hashSync(user.password),
      createdAt: new Date(),
      updatedAt: new Date(),
      id: crypto.randomUUID(),
    };
    usersMock.push(payload);
    return { ...payload, password: undefined };
  }

  async update(user: CreateUserDto) {
    const payload = {
      email: user.email,
      role: user.role,
      password: user.password,
      createdAt: new Date(),
      updatedAt: new Date(),
      id: crypto.randomUUID(),
    };
    return usersMock.push(payload);
  }
  async delete(id: string) {
    return usersMock.filter((user) => user.id !== id);
  }
}
