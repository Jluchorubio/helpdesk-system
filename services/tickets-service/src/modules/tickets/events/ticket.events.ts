import { Ticket } from '../entities/ticket.entity';

export interface TicketCreatedEvent {
  event: 'ticket.created';
  data: Ticket;
}

export interface TicketUpdatedEvent {
  event: 'ticket.updated';
  data: Ticket;
}

export interface TicketDeletedEvent {
  event: 'ticket.deleted';
  data: { id: string };
}
