import { useMutation, useQueryClient } from '@tanstack/react-query';

import { markNotificationRead, markAllNotificationsRead } from './queries';
import { getNotificationsKeys, getUnreadCountKeys } from './keys';

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  const { queryKey: listKey } = getNotificationsKeys();
  const { queryKey: countKey } = getUnreadCountKeys();

  return useMutation({
    mutationFn: markNotificationRead,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: listKey });
      queryClient.invalidateQueries({ queryKey: countKey });
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();
  const { queryKey: listKey } = getNotificationsKeys();
  const { queryKey: countKey } = getUnreadCountKeys();

  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: listKey });
      queryClient.invalidateQueries({ queryKey: countKey });
    },
  });
};
