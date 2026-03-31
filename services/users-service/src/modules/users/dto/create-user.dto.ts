export interface CreateUserDto {
  email: string;
  fullName: string;
  organizationId: string;
  roles?: string[];
}
