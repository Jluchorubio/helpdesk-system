import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { Equipment } from './entities/equipment.entity';
import { InventoryRepository } from './inventory.repository';

@Injectable()
export class InventoryService {
  constructor(private readonly inventoryRepository: InventoryRepository) {}

  async findAll(): Promise<Equipment[]> {
    return this.inventoryRepository.findAll();
  }

  async findById(id: string): Promise<Equipment> {
    const equipment = await this.inventoryRepository.findById(id);
    if (!equipment) {
      throw new NotFoundException('Equipment not found');
    }
    return equipment;
  }

  async create(payload: CreateEquipmentDto): Promise<Equipment> {
    return this.inventoryRepository.create(payload);
  }

  async update(
    id: string,
    payload: UpdateEquipmentDto,
  ): Promise<Equipment> {
    const updated = await this.inventoryRepository.update(id, payload);
    if (!updated) {
      throw new NotFoundException('Equipment not found');
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    const removed = await this.inventoryRepository.remove(id);
    if (!removed) {
      throw new NotFoundException('Equipment not found');
    }
  }
}
