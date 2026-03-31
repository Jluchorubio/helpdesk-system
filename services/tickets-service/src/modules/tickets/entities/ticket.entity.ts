export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface Ticket {
  id: string;
  title: string;
  description?: string;
  status: TicketStatus;
  priority?: string;
  createdAt: string;
  updatedAt: string;
}
