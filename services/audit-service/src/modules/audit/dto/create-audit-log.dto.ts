export interface CreateAuditLogDto {
  action: string;
  entity: string;
  entityId?: string;
}
