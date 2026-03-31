import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileRecord } from './entities/file-record.entity';
import { FilesRepository } from './files.repository';

@Injectable()
export class FilesService {
  constructor(private readonly filesRepository: FilesRepository) {}

  async findAll(): Promise<FileRecord[]> {
    return this.filesRepository.findAll();
  }

  async findById(id: string): Promise<FileRecord> {
    const record = await this.filesRepository.findById(id);
    if (!record) {
      throw new NotFoundException('File not found');
    }
    return record;
  }

  async create(payload: CreateFileDto): Promise<FileRecord> {
    return this.filesRepository.create(payload);
  }

  async update(id: string, payload: UpdateFileDto): Promise<FileRecord> {
    const updated = await this.filesRepository.update(id, payload);
    if (!updated) {
      throw new NotFoundException('File not found');
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    const removed = await this.filesRepository.remove(id);
    if (!removed) {
      throw new NotFoundException('File not found');
    }
  }
}
