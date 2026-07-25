import { useApiQuery } from '@/middleware/api';

import { getNotificationsKeys, getUnreadCountKeys } from './keys';
import { getNotifications, getUnreadCount } from './queries';

export const useGetNotifications = () => {
  const { key, queryKey } = getNotificationsKeys();
  return useApiQuery(key, queryKey, () => getNotifications(), {
    refetchInterval: 30_000,
  });
};

export const useGetUnreadCount = () => {
  const { key, queryKey } = getUnreadCountKeys();
  return useApiQuery(key, queryKey, () => getUnreadCount(), {
    refetchInterval: 30_000,
  });
};
