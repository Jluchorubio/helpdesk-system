import { Module } from '@nestjs/common';
import { AuditModule } from './modules/audit/audit.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [HealthModule, AuditModule],
})
export class AppModule {}
