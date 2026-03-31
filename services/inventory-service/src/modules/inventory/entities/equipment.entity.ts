export type EquipmentStatus = 'active' | 'maintenance' | 'retired';

export interface Equipment {
  id: string;
  name: string;
  status: EquipmentStatus;
  createdAt: string;
  updatedAt: string;
}
