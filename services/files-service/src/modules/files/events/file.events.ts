import { FileRecord } from '../entities/file-record.entity';

export interface FileUploadedEvent {
  event: 'file.uploaded';
  data: FileRecord;
}

export interface FileDeletedEvent {
  event: 'file.deleted';
  data: { id: string };
}
