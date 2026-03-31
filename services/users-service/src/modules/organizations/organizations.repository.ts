import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Organization } from './entities/organization.entity';

@Injectable()
export class OrganizationsRepository {
  private readonly organizations = new Map<string, Organization>();

  async findAll(): Promise<Organization[]> {
    return Array.from(this.organizations.values());
  }

  async findById(id: string): Promise<Organization | null> {
    return this.organizations.get(id) ?? null;
  }

  async create(payload: CreateOrganizationDto): Promise<Organization> {
    const now = new Date().toISOString();
    const organization: Organization = {
      id: randomUUID(),
      name: payload.name,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    };

    this.organizations.set(organization.id, organization);
    return organization;
  }

  async update(
    id: string,
    payload: UpdateOrganizationDto,
  ): Promise<Organization | null> {
    const current = this.organizations.get(id);
    if (!current) {
      return null;
    }

    const updated: Organization = {
      ...current,
      ...payload,
      status: payload.status ?? current.status,
      updatedAt: new Date().toISOString(),
    };

    this.organizations.set(id, updated);
    return updated;
  }

  async remove(id: string): Promise<boolean> {
    return this.organizations.delete(id);
  }
}
