import type { Database } from '../types/generated';
import { executeWithRetry, throwIfSupabaseError } from '../supabase.client';
import { PaginatedResult, PaginationOptions } from './types';

type EquipmentRow = Database['inventory']['Tables']['equipment']['Row'];
type EquipmentInsert = Database['inventory']['Tables']['equipment']['Insert'];
type EquipmentUpdate = Database['inventory']['Tables']['equipment']['Update'];

export interface EquipmentFilters extends PaginationOptions {
  statusId?: number;
  typeId?: number;
  environmentId?: number;
  search?: string;
}

export type Equipment = EquipmentRow;
export type CreateEquipmentDto = EquipmentInsert;
export type UpdateEquipmentDto = EquipmentUpdate;

export class InventoryRepository {
  async findAll(
    organizationId: string,
    filters: EquipmentFilters = {},
  ): Promise<PaginatedResult<Equipment>> {
    return executeWithRetry('admin', async (client) => {
      const page = filters.page ?? 1;
      const pageSize = filters.pageSize ?? 20;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = client
        .schema('inventory')
        .from('equipment')
        .select('*', { count: 'exact' })
        .eq('organization_id', organizationId)
        .is('deleted_at', null);

      if (filters.statusId) {
        query = query.eq('status_id', filters.statusId);
      }
      if (filters.typeId) {
        query = query.eq('type_id', filters.typeId);
      }
      if (filters.environmentId) {
        query = query.eq('environment_id', filters.environmentId);
      }
      if (filters.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      const { data, error, count } = await query.range(from, to);
      throwIfSupabaseError(error, 'InventoryRepository.findAll');

      return {
        data: (data as Equipment[]) ?? [],
        total: count ?? 0,
        page,
        pageSize,
      };
    });
  }

  async findById(id: string, organizationId: string): Promise<Equipment | null> {
    return executeWithRetry('admin', async (client) => {
      const { data, error } = await client
        .schema('inventory')
        .from('equipment')
        .select('*')
        .eq('id', id)
        .eq('organization_id', organizationId)
        .single();

      if (error && error.code === 'PGRST116') {
        return null;
      }
      throwIfSupabaseError(error, 'InventoryRepository.findById');
      return data as Equipment;
    });
  }

  async create(data: CreateEquipmentDto): Promise<Equipment> {
    return executeWithRetry('admin', async (client) => {
      const { data: created, error } = await client
        .schema('inventory')
        .from('equipment')
        .insert(data)
        .select('*')
        .single();

      throwIfSupabaseError(error, 'InventoryRepository.create');
      return created as Equipment;
    });
  }

  async update(id: string, data: UpdateEquipmentDto): Promise<Equipment> {
    return executeWithRetry('admin', async (client) => {
      const { data: updated, error } = await client
        .schema('inventory')
        .from('equipment')
        .update(data)
        .eq('id', id)
        .select('*')
        .single();

      throwIfSupabaseError(error, 'InventoryRepository.update');
      return updated as Equipment;
    });
  }

  async delete(id: string): Promise<void> {
    await executeWithRetry('admin', async (client) => {
      const { error } = await client
        .schema('inventory')
        .from('equipment')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      throwIfSupabaseError(error, 'InventoryRepository.delete');
    });
  }
}
