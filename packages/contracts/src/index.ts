export interface EventMetadata {
  eventId: string;
  occurredAt: string;
  correlationId?: string;
  actorId?: string;
  source: string;
}
