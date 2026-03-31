import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './entities/notification.entity';
import { NotificationsRepository } from './notifications.repository';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  async findAll(): Promise<Notification[]> {
    return this.notificationsRepository.findAll();
  }

  async findById(id: string): Promise<Notification> {
    const notification = await this.notificationsRepository.findById(id);
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    return notification;
  }

  async create(payload: CreateNotificationDto): Promise<Notification> {
    return this.notificationsRepository.create(payload);
  }

  async update(
    id: string,
    payload: UpdateNotificationDto,
  ): Promise<Notification> {
    const updated = await this.notificationsRepository.update(id, payload);
    if (!updated) {
      throw new NotFoundException('Notification not found');
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    const removed = await this.notificationsRepository.remove(id);
    if (!removed) {
      throw new NotFoundException('Notification not found');
    }
  }
}
