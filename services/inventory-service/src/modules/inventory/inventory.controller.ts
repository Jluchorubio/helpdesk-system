import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { Equipment } from './entities/equipment.entity';
import { InventoryService } from './inventory.service';

@Controller('equipment')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  findAll(): Promise<Equipment[]> {
    return this.inventoryService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<Equipment> {
    return this.inventoryService.findById(id);
  }

  @Post()
  create(@Body() payload: CreateEquipmentDto): Promise<Equipment> {
    return this.inventoryService.create(payload);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() payload: UpdateEquipmentDto,
  ): Promise<Equipment> {
    return this.inventoryService.update(id, payload);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ deleted: true }> {
    await this.inventoryService.remove(id);
    return { deleted: true };
  }
}
