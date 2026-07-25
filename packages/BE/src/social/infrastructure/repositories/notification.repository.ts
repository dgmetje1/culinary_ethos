import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ulid } from 'ulidx';
import { Notification, NotificationAttributes } from '../../domain/models/notification.entity';
import { INotificationRepository } from '../../application/repositories/i-notification.repository';

@Injectable()
export class NotificationRepository implements INotificationRepository {
  constructor(
    @InjectRepository(Notification)
    private readonly repository: Repository<Notification>,
  ) {}

  async findByUser(userId: string, limit = 50, offset = 0): Promise<NotificationAttributes[]> {
    const results = await this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });
    return results.map((r) => this.toAttributes(r));
  }

  async findUnreadByUser(userId: string): Promise<NotificationAttributes[]> {
    const results = await this.repository.find({
      where: { userId, read: false },
      order: { createdAt: 'DESC' },
    });
    return results.map((r) => this.toAttributes(r));
  }

  async countUnread(userId: string): Promise<number> {
    return this.repository.count({ where: { userId, read: false } });
  }

  async create(data: Partial<NotificationAttributes>): Promise<NotificationAttributes> {
    const notification = this.repository.create({
      id: ulid(),
      ...data,
      read: false,
    });
    const entity = await this.repository.save(notification);
    return this.toAttributes(entity as Notification);
  }

  async markAsRead(id: string): Promise<boolean> {
    const result = await this.repository.update(id, { read: true });
    return (result.affected ?? 0) > 0;
  }

  async markAllAsRead(userId: string): Promise<boolean> {
    const result = await this.repository.update(
      { userId, read: false },
      { read: true },
    );
    return (result.affected ?? 0) > 0;
  }

  private toAttributes(entity: Notification): NotificationAttributes {
    return {
      id: entity.id,
      userId: entity.userId,
      type: entity.type,
      actorId: entity.actorId,
      actorName: entity.actorName,
      recipeId: entity.recipeId,
      recipeTitle: entity.recipeTitle,
      read: entity.read,
      createdAt: entity.createdAt,
    };
  }
}
