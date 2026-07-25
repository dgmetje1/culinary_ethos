export const API_ACTION_BASE = 'follows';

export const getIsFollowingKeys = (userId: string) => {
  const queryKey = [API_ACTION_BASE, 'isFollowing', userId];
  const key = queryKey.join('/');
  return { key, queryKey };
};

export const getFollowersCountKeys = (userId: string) => {
  const queryKey = [API_ACTION_BASE, 'followers', userId];
  const key = queryKey.join('/');
  return { key, queryKey };
};

export const getFollowingCountKeys = (userId: string) => {
  const queryKey = [API_ACTION_BASE, 'following', userId];
  const key = queryKey.join('/');
  return { key, queryKey };
};
