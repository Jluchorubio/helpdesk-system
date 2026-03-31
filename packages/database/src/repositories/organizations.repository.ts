import type { Database } from '../types/generated';
import { executeWithRetry, throwIfSupabaseError } from '../supabase.client';
import { PaginatedResult, PaginationOptions } from './types';

type OrganizationRow = Database['users']['Tables']['organizations']['Row'];
type OrganizationInsert = Database['users']['Tables']['organizations']['Insert'];
type OrganizationUpdate = Database['users']['Tables']['organizations']['Update'];

export interface OrganizationFilters extends PaginationOptions {
  search?: string;
}

export type Organization = OrganizationRow;
export type CreateOrganizationDto = OrganizationInsert;
export type UpdateOrganizationDto = OrganizationUpdate;

export class OrganizationsRepository {
  async findAll(
    filters: OrganizationFilters = {},
  ): Promise<PaginatedResult<Organization>> {
    return executeWithRetry('admin', async (client) => {
      const page = filters.page ?? 1;
      const pageSize = filters.pageSize ?? 20;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = client
        .schema('users')
        .from('organizations')
        .select('*', { count: 'exact' })
        .is('deleted_at', null);

      if (filters.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      const { data, error, count } = await query.range(from, to);
      throwIfSupabaseError(error, 'OrganizationsRepository.findAll');

      return {
        data: (data as Organization[]) ?? [],
        total: count ?? 0,
        page,
        pageSize,
      };
    });
  }

  async findById(id: string): Promise<Organization | null> {
    return executeWithRetry('admin', async (client) => {
      const { data, error } = await client
        .schema('users')
        .from('organizations')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code === 'PGRST116') {
        return null;
      }
      throwIfSupabaseError(error, 'OrganizationsRepository.findById');
      return data as Organization;
    });
  }

  async create(data: CreateOrganizationDto): Promise<Organization> {
    return executeWithRetry('admin', async (client) => {
      const { data: created, error } = await client
        .schema('users')
        .from('organizations')
        .insert(data)
        .select('*')
        .single();

      throwIfSupabaseError(error, 'OrganizationsRepository.create');
      return created as Organization;
    });
  }

  async update(id: string, data: UpdateOrganizationDto): Promise<Organization> {
    return executeWithRetry('admin', async (client) => {
      const { data: updated, error } = await client
        .schema('users')
        .from('organizations')
        .update(data)
        .eq('id', id)
        .select('*')
        .single();

      throwIfSupabaseError(error, 'OrganizationsRepository.update');
      return updated as Organization;
    });
  }

  async delete(id: string): Promise<void> {
    await executeWithRetry('admin', async (client) => {
      const { error } = await client
        .schema('users')
        .from('organizations')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      throwIfSupabaseError(error, 'OrganizationsRepository.delete');
    });
  }
}
