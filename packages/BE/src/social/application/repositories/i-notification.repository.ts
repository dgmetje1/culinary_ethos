import { NotificationAttributes } from "../../domain/models/notification.entity";

export const NOTIFICATION_REPOSITORY = "NOTIFICATION_REPOSITORY";

export interface INotificationRepository {
  findByUser(userId: string, limit?: number, offset?: number): Promise<NotificationAttributes[]>;
  findUnreadByUser(userId: string): Promise<NotificationAttributes[]>;
  countUnread(userId: string): Promise<number>;
  create(data: Partial<NotificationAttributes>): Promise<NotificationAttributes>;
  markAsRead(id: string): Promise<boolean>;
  markAllAsRead(userId: string): Promise<boolean>;
}
