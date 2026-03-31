import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsRepository {
  private readonly notifications = new Map<string, Notification>();

  async findAll(): Promise<Notification[]> {
    return Array.from(this.notifications.values());
  }

  async findById(id: string): Promise<Notification | null> {
    return this.notifications.get(id) ?? null;
  }

  async create(payload: CreateNotificationDto): Promise<Notification> {
    const notification: Notification = {
      id: randomUUID(),
      userId: payload.userId,
      type: payload.type,
      message: payload.message,
      status: 'unread',
      createdAt: new Date().toISOString(),
    };

    this.notifications.set(notification.id, notification);
    return notification;
  }

  async update(
    id: string,
    payload: UpdateNotificationDto,
  ): Promise<Notification | null> {
    const current = this.notifications.get(id);
    if (!current) {
      return null;
    }

    const updated: Notification = {
      ...current,
      status: payload.status ?? current.status,
    };

    this.notifications.set(id, updated);
    return updated;
  }

  async remove(id: string): Promise<boolean> {
    return this.notifications.delete(id);
  }
}
