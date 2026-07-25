import { Injectable, Inject } from '@nestjs/common';
import { NOTIFICATION_REPOSITORY, INotificationRepository } from '../repositories/i-notification.repository';

@Injectable()
export class NotificationsService {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async getNotifications(userId: string): Promise<NotificationListItem[]> {
    const notifications = await this.notificationRepository.findByUser(userId, 50);
    return notifications.map((n) => ({
      id: n.id,
      type: n.type,
      actorId: n.actorId,
      actorName: n.actorName,
      recipeId: n.recipeId,
      recipeTitle: n.recipeTitle,
      read: n.read,
      createdAt: n.createdAt,
    }));
  }

  async getUnreadCount(userId: string): Promise<{ count: number }> {
    const count = await this.notificationRepository.countUnread(userId);
    return { count };
  }

  async markAsRead(userId: string, notificationId: string): Promise<void> {
    await this.notificationRepository.markAsRead(notificationId);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.markAllAsRead(userId);
  }
}

export interface NotificationListItem {
  id: string;
  type: string;
  actorId?: string;
  actorName?: string;
  recipeId?: string;
  recipeTitle?: string;
  read: boolean;
  createdAt: Date;
}
