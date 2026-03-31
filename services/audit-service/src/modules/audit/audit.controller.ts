import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { AuditLog } from './entities/audit-log.entity';
import { AuditService } from './audit.service';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  findAll(): Promise<AuditLog[]> {
    return this.auditService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<AuditLog> {
    return this.auditService.findById(id);
  }

  @Post()
  create(@Body() payload: CreateAuditLogDto): Promise<AuditLog> {
    return this.auditService.create(payload);
  }
}
