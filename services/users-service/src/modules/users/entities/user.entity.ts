export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface User {
  id: string;
  email: string;
  fullName: string;
  organizationId: string;
  roles: string[];
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}
