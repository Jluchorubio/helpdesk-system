import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket } from './entities/ticket.entity';
import { TicketsService } from './tickets.service';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  findAll(): Promise<Ticket[]> {
    return this.ticketsService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<Ticket> {
    return this.ticketsService.findById(id);
  }

  @Post()
  create(@Body() payload: CreateTicketDto): Promise<Ticket> {
    return this.ticketsService.create(payload);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() payload: UpdateTicketDto,
  ): Promise<Ticket> {
    return this.ticketsService.update(id, payload);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ deleted: true }> {
    await this.ticketsService.remove(id);
    return { deleted: true };
  }
}
