import type { Database } from '../types/generated';
import { executeWithRetry, throwIfSupabaseError } from '../supabase.client';
import { PaginatedResult, PaginationOptions } from './types';

type UserRow = Database['users']['Tables']['users']['Row'];
type UserInsert = Database['users']['Tables']['users']['Insert'];
type UserUpdate = Database['users']['Tables']['users']['Update'];

export interface UserFilters extends PaginationOptions {
  roleId?: number;
  search?: string;
}

export type User = UserRow;
export type CreateUserDto = UserInsert;
export type UpdateUserDto = UserUpdate;

export class UsersRepository {
  async findAll(
    organizationId: string,
    filters: UserFilters = {},
  ): Promise<PaginatedResult<User>> {
    return executeWithRetry('admin', async (client) => {
      const page = filters.page ?? 1;
      const pageSize = filters.pageSize ?? 20;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = client
        .schema('users')
        .from('users')
        .select('*', { count: 'exact' })
        .eq('organization_id', organizationId)
        .is('deleted_at', null);

      if (filters.roleId) {
        query = query.eq('role_id', filters.roleId);
      }
      if (filters.search) {
        query = query.or(
          `first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%`,
        );
      }

      const { data, error, count } = await query.range(from, to);
      throwIfSupabaseError(error, 'UsersRepository.findAll');

      return {
        data: (data as User[]) ?? [],
        total: count ?? 0,
        page,
        pageSize,
      };
    });
  }

  async findById(id: string, organizationId: string): Promise<User | null> {
    return executeWithRetry('admin', async (client) => {
      const { data, error } = await client
        .schema('users')
        .from('users')
        .select('*')
        .eq('id', id)
        .eq('organization_id', organizationId)
        .single();

      if (error && error.code === 'PGRST116') {
        return null;
      }
      throwIfSupabaseError(error, 'UsersRepository.findById');
      return data as User;
    });
  }

  async create(data: CreateUserDto): Promise<User> {
    return executeWithRetry('admin', async (client) => {
      const { data: created, error } = await client
        .schema('users')
        .from('users')
        .insert(data)
        .select('*')
        .single();

      throwIfSupabaseError(error, 'UsersRepository.create');
      return created as User;
    });
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    return executeWithRetry('admin', async (client) => {
      const { data: updated, error } = await client
        .schema('users')
        .from('users')
        .update(data)
        .eq('id', id)
        .select('*')
        .single();

      throwIfSupabaseError(error, 'UsersRepository.update');
      return updated as User;
    });
  }

  async delete(id: string): Promise<void> {
    await executeWithRetry('admin', async (client) => {
      const { error } = await client
        .schema('users')
        .from('users')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      throwIfSupabaseError(error, 'UsersRepository.delete');
    });
  }
}
