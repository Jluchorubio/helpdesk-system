import { Notification } from '../entities/notification.entity';

export interface NotificationCreatedEvent {
  event: 'notification.created';
  data: Notification;
}

export interface NotificationUpdatedEvent {
  event: 'notification.updated';
  data: Notification;
}
