import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AuthAccount } from './entities/auth-account.entity';

@Injectable()
export class AuthRepository {
  private readonly accounts = new Map<string, AuthAccount>();

  async findAll(): Promise<AuthAccount[]> {
    return Array.from(this.accounts.values());
  }

  async findById(id: string): Promise<AuthAccount | null> {
    return this.accounts.get(id) ?? null;
  }

  async findByEmail(email: string): Promise<AuthAccount | null> {
    return (
      Array.from(this.accounts.values()).find((account) => account.email === email) ??
      null
    );
  }

  async create(payload: CreateAccountDto): Promise<AuthAccount> {
    const now = new Date().toISOString();
    const account: AuthAccount = {
      id: randomUUID(),
      email: payload.email,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    };

    this.accounts.set(account.id, account);
    return account;
  }

  async update(
    id: string,
    payload: UpdateAccountDto,
  ): Promise<AuthAccount | null> {
    const current = this.accounts.get(id);
    if (!current) {
      return null;
    }

    const updated: AuthAccount = {
      ...current,
      ...payload,
      status: payload.status ?? current.status,
      updatedAt: new Date().toISOString(),
    };

    this.accounts.set(id, updated);
    return updated;
  }

  async remove(id: string): Promise<boolean> {
    return this.accounts.delete(id);
  }
}
