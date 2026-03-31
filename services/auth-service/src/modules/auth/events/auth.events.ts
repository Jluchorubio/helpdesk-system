import { AuthAccount } from '../entities/auth-account.entity';

export interface AuthAccountCreatedEvent {
  event: 'auth.account.created';
  data: AuthAccount;
}

export interface AuthAccountUpdatedEvent {
  event: 'auth.account.updated';
  data: AuthAccount;
}

export interface AuthAccountDeletedEvent {
  event: 'auth.account.deleted';
  data: { id: string };
}
