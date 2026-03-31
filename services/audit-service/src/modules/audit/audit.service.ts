import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { AuditLog } from './entities/audit-log.entity';
import { AuditRepository } from './audit.repository';

@Injectable()
export class AuditService {
  constructor(private readonly auditRepository: AuditRepository) {}

  async findAll(): Promise<AuditLog[]> {
    return this.auditRepository.findAll();
  }

  async findById(id: string): Promise<AuditLog> {
    const log = await this.auditRepository.findById(id);
    if (!log) {
      throw new NotFoundException('Audit log not found');
    }
    return log;
  }

  async create(payload: CreateAuditLogDto): Promise<AuditLog> {
    return this.auditRepository.create(payload);
  }
}
