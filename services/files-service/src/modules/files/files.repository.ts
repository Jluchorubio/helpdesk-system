import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileRecord } from './entities/file-record.entity';

@Injectable()
export class FilesRepository {
  private readonly files = new Map<string, FileRecord>();

  async findAll(): Promise<FileRecord[]> {
    return Array.from(this.files.values());
  }

  async findById(id: string): Promise<FileRecord | null> {
    return this.files.get(id) ?? null;
  }

  async create(payload: CreateFileDto): Promise<FileRecord> {
    const record: FileRecord = {
      id: randomUUID(),
      ticketId: payload.ticketId,
      fileName: payload.fileName,
      fileType: payload.fileType,
      fileSize: payload.fileSize,
      createdAt: new Date().toISOString(),
    };

    this.files.set(record.id, record);
    return record;
  }

  async update(id: string, payload: UpdateFileDto): Promise<FileRecord | null> {
    const current = this.files.get(id);
    if (!current) {
      return null;
    }

    const updated: FileRecord = {
      ...current,
      ...payload,
    };

    this.files.set(id, updated);
    return updated;
  }

  async remove(id: string): Promise<boolean> {
    return this.files.delete(id);
  }
}
