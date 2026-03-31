import type { Database } from '../types/generated';
import { executeWithRetry, throwIfSupabaseError } from '../supabase.client';
import { PaginatedResult, PaginationOptions } from './types';

type AuditRow = Database['audit']['Tables']['audit_logs']['Row'];
type AuditInsert = Database['audit']['Tables']['audit_logs']['Insert'];

export interface AuditFilters extends PaginationOptions {
  organizationId?: string;
  userId?: string;
  action?: string;
  entity?: string;
}

export type AuditLog = AuditRow;
export type CreateAuditLogDto = AuditInsert;

export class AuditRepository {
  async findAll(filters: AuditFilters = {}): Promise<PaginatedResult<AuditLog>> {
    return executeWithRetry('admin', async (client) => {
      const page = filters.page ?? 1;
      const pageSize = filters.pageSize ?? 50;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = client
        .schema('audit')
        .from('audit_logs')
        .select('*', { count: 'exact' });

      if (filters.organizationId) {
        query = query.eq('organization_id', filters.organizationId);
      }
      if (filters.userId) {
        query = query.eq('user_id', filters.userId);
      }
      if (filters.action) {
        query = query.eq('action', filters.action);
      }
      if (filters.entity) {
        query = query.eq('entity', filters.entity);
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      throwIfSupabaseError(error, 'AuditRepository.findAll');

      return {
        data: (data as AuditLog[]) ?? [],
        total: count ?? 0,
        page,
        pageSize,
      };
    });
  }

  async create(data: CreateAuditLogDto): Promise<AuditLog> {
    return executeWithRetry('admin', async (client) => {
      const { data: created, error } = await client
        .schema('audit')
        .from('audit_logs')
        .insert(data)
        .select('*')
        .single();

      throwIfSupabaseError(error, 'AuditRepository.create');
      return created as AuditLog;
    });
  }
}
