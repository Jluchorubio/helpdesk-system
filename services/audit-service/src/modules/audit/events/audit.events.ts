import { AuditLog } from '../entities/audit-log.entity';

export interface AuditLoggedEvent {
  event: 'audit.logged';
  data: AuditLog;
}
