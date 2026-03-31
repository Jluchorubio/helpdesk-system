export interface UpdateEquipmentDto {
  name?: string;
  status?: 'active' | 'maintenance' | 'retired';
}
