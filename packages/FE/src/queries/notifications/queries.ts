import { Api } from "@/lib/api";
import type { NotificationItem, UnreadCount } from "@/types/notification";

export const getNotifications = () => {
  return new Api().get<NotificationItem[]>("notifications", { withAuth: true });
};

export const getUnreadCount = () => {
  return new Api().get<UnreadCount>("notifications/unread/count", { withAuth: true });
};

export const markNotificationRead = (id: string) => {
  return new Api().put<void>(`notifications/${id}/read`, {}, { withAuth: true });
};

export const markAllNotificationsRead = () => {
  return new Api().put<void>("notifications/read/all", {}, { withAuth: true });
};
