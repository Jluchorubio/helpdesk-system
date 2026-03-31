import type { Database } from '../types/generated';
import { executeWithRetry, throwIfSupabaseError } from '../supabase.client';
import { PaginatedResult, PaginationOptions, SortOrder } from './types';

type TicketRow = Database['tickets']['Tables']['tickets']['Row'];
type TicketInsert = Database['tickets']['Tables']['tickets']['Insert'];
type TicketUpdate = Database['tickets']['Tables']['tickets']['Update'];

export interface TicketFilters extends PaginationOptions {
  statusId?: number;
  priorityId?: number;
  categoryId?: number;
  assignedTo?: string;
  createdBy?: string;
  search?: string;
  sortBy?: 'created_at' | 'updated_at' | 'priority_id' | 'status_id' | 'ticket_number';
  sortOrder?: SortOrder;
}

export type Ticket = TicketRow;
export type CreateTicketDto = Omit<TicketInsert, 'organization_id' | 'ticket_number' | 'created_by'>;
export type UpdateTicketDto = TicketUpdate;

export class TicketsRepository {
  async findAll(
    organizationId: string,
    filters: TicketFilters,
  ): Promise<PaginatedResult<Ticket>> {
    return executeWithRetry('admin', async (client) => {
      const page = filters.page ?? 1;
      const pageSize = filters.pageSize ?? 20;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      const sortBy = filters.sortBy ?? 'created_at';
      const sortOrder = filters.sortOrder ?? 'desc';

      let query = client
        .schema('tickets')
        .from('tickets')
        .select('*', { count: 'exact' })
        .eq('organization_id', organizationId)
        .is('deleted_at', null);

      if (filters.statusId) {
        query = query.eq('status_id', filters.statusId);
      }
      if (filters.priorityId) {
        query = query.eq('priority_id', filters.priorityId);
      }
      if (filters.categoryId) {
        query = query.eq('category_id', filters.categoryId);
      }
      if (filters.assignedTo) {
        query = query.eq('assigned_to', filters.assignedTo);
      }
      if (filters.createdBy) {
        query = query.eq('created_by', filters.createdBy);
      }
      if (filters.search) {
        query = query.ilike('title', `%${filters.search}%`);
      }

      const { data, error, count } = await query
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(from, to);

      throwIfSupabaseError(error, 'TicketsRepository.findAll');

      return {
        data: (data as Ticket[]) ?? [],
        total: count ?? 0,
        page,
        pageSize,
      };
    });
  }

  async findById(id: string, organizationId: string): Promise<Ticket | null> {
    return executeWithRetry('admin', async (client) => {
      const { data, error } = await client
        .schema('tickets')
        .from('tickets')
        .select('*')
        .eq('id', id)
        .eq('organization_id', organizationId)
        .single();

      if (error && error.code === 'PGRST116') {
        return null;
      }
      throwIfSupabaseError(error, 'TicketsRepository.findById');
      return data as Ticket;
    });
  }

  async create(
    data: CreateTicketDto,
    organizationId: string,
    userId: string,
  ): Promise<Ticket> {
    return executeWithRetry('admin', async (client) => {
      const ticketNumber = await this.getNextTicketNumber(organizationId);
      const payload: TicketInsert = {
        ...data,
        organization_id: organizationId,
        ticket_number: Number(ticketNumber),
        created_by: userId,
      } as TicketInsert;

      const { data: created, error } = await client
        .schema('tickets')
        .from('tickets')
        .insert(payload)
        .select('*')
        .single();

      throwIfSupabaseError(error, 'TicketsRepository.create');
      return created as Ticket;
    });
  }

  async update(
    id: string,
    organizationId: string,
    data: UpdateTicketDto,
  ): Promise<Ticket> {
    return executeWithRetry('admin', async (client) => {
      const { data: updated, error } = await client
        .schema('tickets')
        .from('tickets')
        .update(data)
        .eq('id', id)
        .eq('organization_id', organizationId)
        .select('*')
        .single();

      throwIfSupabaseError(error, 'TicketsRepository.update');
      return updated as Ticket;
    });
  }

  async delete(id: string, organizationId: string): Promise<void> {
    await executeWithRetry('admin', async (client) => {
      const { error } = await client
        .schema('tickets')
        .from('tickets')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
        .eq('organization_id', organizationId);

      throwIfSupabaseError(error, 'TicketsRepository.delete');
    });
  }

  async getNextTicketNumber(organizationId: string): Promise<string> {
    return executeWithRetry('admin', async (client) => {
      const { data, error } = await client
        .schema('tickets')
        .rpc('next_ticket_number', { p_organization_id: organizationId });

      throwIfSupabaseError(error, 'TicketsRepository.getNextTicketNumber');
      return String(data ?? '');
    });
  }
}
