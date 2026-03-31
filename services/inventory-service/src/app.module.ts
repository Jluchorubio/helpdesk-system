import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/health.module';
import { InventoryModule } from './modules/inventory/inventory.module';

@Module({
  imports: [HealthModule, InventoryModule],
})
export class AppModule {}
