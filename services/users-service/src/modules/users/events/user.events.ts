import { User } from '../entities/user.entity';

export interface UserCreatedEvent {
  event: 'user.created';
  data: User;
}

export interface UserUpdatedEvent {
  event: 'user.updated';
  data: User;
}

export interface UserDeletedEvent {
  event: 'user.deleted';
  data: { id: string };
}
