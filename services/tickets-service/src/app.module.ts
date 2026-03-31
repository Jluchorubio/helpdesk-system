import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/health.module';
import { TicketsModule } from './modules/tickets/tickets.module';

@Module({
  imports: [HealthModule, TicketsModule],
})
export class AppModule {}
