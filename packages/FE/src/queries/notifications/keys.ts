export const API_ACTION_BASE = 'notifications';

export const getNotificationsKeys = () => {
  const queryKey = [API_ACTION_BASE, 'list'];
  const key = queryKey.join('/');
  return { key, queryKey };
};

export const getUnreadCountKeys = () => {
  const queryKey = [API_ACTION_BASE, 'unread', 'count'];
  const key = queryKey.join('/');
  return { key, queryKey };
};
