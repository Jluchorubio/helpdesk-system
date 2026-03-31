import type { Database } from '../types/generated';
import { executeWithRetry, throwIfSupabaseError } from '../supabase.client';
import { PaginatedResult, PaginationOptions } from './types';

type NotificationRow = Database['notifications']['Tables']['notifications']['Row'];
type NotificationInsert = Database['notifications']['Tables']['notifications']['Insert'];
type NotificationUpdate = Database['notifications']['Tables']['notifications']['Update'];

export interface NotificationFilters extends PaginationOptions {
  userId?: string;
  isRead?: boolean;
}

export type Notification = NotificationRow;
export type CreateNotificationDto = NotificationInsert;
export type UpdateNotificationDto = NotificationUpdate;

export class NotificationsRepository {
  async findAll(
    filters: NotificationFilters = {},
  ): Promise<PaginatedResult<Notification>> {
    return executeWithRetry('admin', async (client) => {
      const page = filters.page ?? 1;
      const pageSize = filters.pageSize ?? 20;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = client
        .schema('notifications')
        .from('notifications')
        .select('*', { count: 'exact' })
        .is('deleted_at', null);

      if (filters.userId) {
        query = query.eq('user_id', filters.userId);
      }
      if (filters.isRead !== undefined) {
        query = query.eq('is_read', filters.isRead);
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      throwIfSupabaseError(error, 'NotificationsRepository.findAll');

      return {
        data: (data as Notification[]) ?? [],
        total: count ?? 0,
        page,
        pageSize,
      };
    });
  }

  async findById(id: string): Promise<Notification | null> {
    return executeWithRetry('admin', async (client) => {
      const { data, error } = await client
        .schema('notifications')
        .from('notifications')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code === 'PGRST116') {
        return null;
      }
      throwIfSupabaseError(error, 'NotificationsRepository.findById');
      return data as Notification;
    });
  }

  async create(data: CreateNotificationDto): Promise<Notification> {
    return executeWithRetry('admin', async (client) => {
      const { data: created, error } = await client
        .schema('notifications')
        .from('notifications')
        .insert(data)
        .select('*')
        .single();

      throwIfSupabaseError(error, 'NotificationsRepository.create');
      return created as Notification;
    });
  }

  async update(id: string, data: UpdateNotificationDto): Promise<Notification> {
    return executeWithRetry('admin', async (client) => {
      const { data: updated, error } = await client
        .schema('notifications')
        .from('notifications')
        .update(data)
        .eq('id', id)
        .select('*')
        .single();

      throwIfSupabaseError(error, 'NotificationsRepository.update');
      return updated as Notification;
    });
  }

  async delete(id: string): Promise<void> {
    await executeWithRetry('admin', async (client) => {
      const { error } = await client
        .schema('notifications')
        .from('notifications')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      throwIfSupabaseError(error, 'NotificationsRepository.delete');
    });
  }
}
