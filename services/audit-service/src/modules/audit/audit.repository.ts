import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { AuditLog } from './entities/audit-log.entity';

@Injectable()
export class AuditRepository {
  private readonly logs = new Map<string, AuditLog>();

  async findAll(): Promise<AuditLog[]> {
    return Array.from(this.logs.values());
  }

  async findById(id: string): Promise<AuditLog | null> {
    return this.logs.get(id) ?? null;
  }

  async create(payload: CreateAuditLogDto): Promise<AuditLog> {
    const log: AuditLog = {
      id: randomUUID(),
      action: payload.action,
      entity: payload.entity,
      entityId: payload.entityId,
      createdAt: new Date().toISOString(),
    };

    this.logs.set(log.id, log);
    return log;
  }
}
