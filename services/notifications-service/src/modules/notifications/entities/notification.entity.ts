export type NotificationStatus = 'unread' | 'read';

export interface Notification {
  id: string;
  userId: string;
  type: string;
  message: string;
  status: NotificationStatus;
  createdAt: string;
}
