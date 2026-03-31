import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileRecord } from './entities/file-record.entity';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get()
  findAll(): Promise<FileRecord[]> {
    return this.filesService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<FileRecord> {
    return this.filesService.findById(id);
  }

  @Post()
  create(@Body() payload: CreateFileDto): Promise<FileRecord> {
    return this.filesService.create(payload);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() payload: UpdateFileDto,
  ): Promise<FileRecord> {
    return this.filesService.update(id, payload);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ deleted: true }> {
    await this.filesService.remove(id);
    return { deleted: true };
  }
}
