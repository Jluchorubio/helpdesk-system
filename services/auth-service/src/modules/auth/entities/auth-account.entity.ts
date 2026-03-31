export type AuthAccountStatus = 'active' | 'disabled';

export interface AuthAccount {
  id: string;
  email: string;
  status: AuthAccountStatus;
  createdAt: string;
  updatedAt: string;
}
