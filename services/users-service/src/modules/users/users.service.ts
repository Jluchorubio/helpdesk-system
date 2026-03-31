import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async create(payload: CreateUserDto): Promise<User> {
    return this.usersRepository.create(payload);
  }

  async update(id: string, payload: UpdateUserDto): Promise<User> {
    const updated = await this.usersRepository.update(id, payload);
    if (!updated) {
      throw new NotFoundException('User not found');
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    const removed = await this.usersRepository.remove(id);
    if (!removed) {
      throw new NotFoundException('User not found');
    }
  }
}
