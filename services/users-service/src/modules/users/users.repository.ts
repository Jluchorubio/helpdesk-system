import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersRepository {
  private readonly users = new Map<string, User>();

  async findAll(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) ?? null;
  }

  async create(payload: CreateUserDto): Promise<User> {
    const now = new Date().toISOString();
    const user: User = {
      id: randomUUID(),
      email: payload.email,
      fullName: payload.fullName,
      organizationId: payload.organizationId,
      roles: payload.roles ?? [],
      status: 'active',
      createdAt: now,
      updatedAt: now,
    };

    this.users.set(user.id, user);
    return user;
  }

  async update(id: string, payload: UpdateUserDto): Promise<User | null> {
    const current = this.users.get(id);
    if (!current) {
      return null;
    }

    const updated: User = {
      ...current,
      ...payload,
      roles: payload.roles ?? current.roles,
      status: payload.status ?? current.status,
      updatedAt: new Date().toISOString(),
    };

    this.users.set(id, updated);
    return updated;
  }

  async remove(id: string): Promise<boolean> {
    return this.users.delete(id);
  }
}
