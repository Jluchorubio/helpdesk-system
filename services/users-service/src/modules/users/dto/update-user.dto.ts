export interface UpdateUserDto {
  email?: string;
  fullName?: string;
  organizationId?: string;
  roles?: string[];
  status?: 'active' | 'inactive' | 'suspended';
}
