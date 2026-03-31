import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket } from './entities/ticket.entity';
import { TicketsRepository } from './tickets.repository';

@Injectable()
export class TicketsService {
  constructor(private readonly ticketsRepository: TicketsRepository) {}

  async findAll(): Promise<Ticket[]> {
    return this.ticketsRepository.findAll();
  }

  async findById(id: string): Promise<Ticket> {
    const ticket = await this.ticketsRepository.findById(id);
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    return ticket;
  }

  async create(payload: CreateTicketDto): Promise<Ticket> {
    return this.ticketsRepository.create(payload);
  }

  async update(id: string, payload: UpdateTicketDto): Promise<Ticket> {
    const updated = await this.ticketsRepository.update(id, payload);
    if (!updated) {
      throw new NotFoundException('Ticket not found');
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    const removed = await this.ticketsRepository.remove(id);
    if (!removed) {
      throw new NotFoundException('Ticket not found');
    }
  }
}
