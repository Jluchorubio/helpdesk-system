import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AuthAccount } from './entities/auth-account.entity';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async findAll(): Promise<AuthAccount[]> {
    return this.authRepository.findAll();
  }

  async findById(id: string): Promise<AuthAccount> {
    const account = await this.authRepository.findById(id);
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    return account;
  }

  async create(payload: CreateAccountDto): Promise<AuthAccount> {
    return this.authRepository.create(payload);
  }

  async update(id: string, payload: UpdateAccountDto): Promise<AuthAccount> {
    const updated = await this.authRepository.update(id, payload);
    if (!updated) {
      throw new NotFoundException('Account not found');
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    const removed = await this.authRepository.remove(id);
    if (!removed) {
      throw new NotFoundException('Account not found');
    }
  }
}
