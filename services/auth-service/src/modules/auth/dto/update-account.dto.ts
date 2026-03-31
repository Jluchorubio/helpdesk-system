export interface UpdateAccountDto {
  email?: string;
  password?: string;
  status?: 'active' | 'disabled';
}
