import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket } from './entities/ticket.entity';

@Injectable()
export class TicketsRepository {
  private readonly tickets = new Map<string, Ticket>();

  async findAll(): Promise<Ticket[]> {
    return Array.from(this.tickets.values());
  }

  async findById(id: string): Promise<Ticket | null> {
    return this.tickets.get(id) ?? null;
  }

  async create(payload: CreateTicketDto): Promise<Ticket> {
    const now = new Date().toISOString();
    const ticket: Ticket = {
      id: randomUUID(),
      title: payload.title,
      description: payload.description,
      status: 'open',
      priority: payload.priority,
      createdAt: now,
      updatedAt: now,
    };

    this.tickets.set(ticket.id, ticket);
    return ticket;
  }

  async update(id: string, payload: UpdateTicketDto): Promise<Ticket | null> {
    const current = this.tickets.get(id);
    if (!current) {
      return null;
    }

    const updated: Ticket = {
      ...current,
      ...payload,
      status: payload.status ?? current.status,
      priority: payload.priority ?? current.priority,
      updatedAt: new Date().toISOString(),
    };

    this.tickets.set(id, updated);
    return updated;
  }

  async remove(id: string): Promise<boolean> {
    return this.tickets.delete(id);
  }
}
