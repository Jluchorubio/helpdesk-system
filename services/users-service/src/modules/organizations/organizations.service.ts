import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Organization } from './entities/organization.entity';
import { OrganizationsRepository } from './organizations.repository';

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly organizationsRepository: OrganizationsRepository,
  ) {}

  async findAll(): Promise<Organization[]> {
    return this.organizationsRepository.findAll();
  }

  async findById(id: string): Promise<Organization> {
    const organization = await this.organizationsRepository.findById(id);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
    return organization;
  }

  async create(payload: CreateOrganizationDto): Promise<Organization> {
    return this.organizationsRepository.create(payload);
  }

  async update(
    id: string,
    payload: UpdateOrganizationDto,
  ): Promise<Organization> {
    const updated = await this.organizationsRepository.update(id, payload);
    if (!updated) {
      throw new NotFoundException('Organization not found');
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    const removed = await this.organizationsRepository.remove(id);
    if (!removed) {
      throw new NotFoundException('Organization not found');
    }
  }
}
