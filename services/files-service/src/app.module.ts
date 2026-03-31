import { Module } from '@nestjs/common';
import { FilesModule } from './modules/files/files.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [HealthModule, FilesModule],
})
export class AppModule {}
