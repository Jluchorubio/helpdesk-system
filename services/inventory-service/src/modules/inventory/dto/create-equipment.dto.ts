export interface CreateEquipmentDto {
  name: string;
  status?: 'active' | 'maintenance' | 'retired';
}
