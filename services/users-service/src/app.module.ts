import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/health.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [HealthModule, UsersModule, OrganizationsModule],
})
export class AppModule {}
