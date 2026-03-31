import { Equipment } from '../entities/equipment.entity';

export interface EquipmentCreatedEvent {
  event: 'equipment.created';
  data: Equipment;
}

export interface EquipmentUpdatedEvent {
  event: 'equipment.updated';
  data: Equipment;
}

export interface EquipmentDeletedEvent {
  event: 'equipment.deleted';
  data: { id: string };
}
