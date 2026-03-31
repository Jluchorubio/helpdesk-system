import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { Equipment } from './entities/equipment.entity';

@Injectable()
export class InventoryRepository {
  private readonly items = new Map<string, Equipment>();

  async findAll(): Promise<Equipment[]> {
    return Array.from(this.items.values());
  }

  async findById(id: string): Promise<Equipment | null> {
    return this.items.get(id) ?? null;
  }

  async create(payload: CreateEquipmentDto): Promise<Equipment> {
    const now = new Date().toISOString();
    const equipment: Equipment = {
      id: randomUUID(),
      name: payload.name,
      status: payload.status ?? 'active',
      createdAt: now,
      updatedAt: now,
    };

    this.items.set(equipment.id, equipment);
    return equipment;
  }

  async update(
    id: string,
    payload: UpdateEquipmentDto,
  ): Promise<Equipment | null> {
    const current = this.items.get(id);
    if (!current) {
      return null;
    }

    const updated: Equipment = {
      ...current,
      ...payload,
      status: payload.status ?? current.status,
      updatedAt: new Date().toISOString(),
    };

    this.items.set(id, updated);
    return updated;
  }

  async remove(id: string): Promise<boolean> {
    return this.items.delete(id);
  }
}
