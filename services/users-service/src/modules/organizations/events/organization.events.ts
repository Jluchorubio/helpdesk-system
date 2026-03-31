import { Organization } from '../entities/organization.entity';

export interface OrganizationCreatedEvent {
  event: 'organization.created';
  data: Organization;
}

export interface OrganizationUpdatedEvent {
  event: 'organization.updated';
  data: Organization;
}

export interface OrganizationDeletedEvent {
  event: 'organization.deleted';
  data: { id: string };
}
