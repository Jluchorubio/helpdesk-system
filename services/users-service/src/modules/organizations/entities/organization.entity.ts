export type OrganizationStatus = 'active' | 'inactive';

export interface Organization {
  id: string;
  name: string;
  status: OrganizationStatus;
  createdAt: string;
  updatedAt: string;
}
