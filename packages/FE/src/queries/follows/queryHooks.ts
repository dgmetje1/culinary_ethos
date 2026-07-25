import { useApiQuery } from '@/middleware/api';

import { getIsFollowingKeys, getFollowersCountKeys, getFollowingCountKeys } from './keys';
import { getIsFollowing, getFollowersCount, getFollowingCount } from './queries';

export const useGetIsFollowing = (userId: string) => {
  const { key, queryKey } = getIsFollowingKeys(userId);
  return useApiQuery(key, queryKey, () => getIsFollowing(userId));
};

export const useGetFollowersCount = (userId: string) => {
  const { key, queryKey } = getFollowersCountKeys(userId);
  return useApiQuery(key, queryKey, () => getFollowersCount(userId));
};

export const useGetFollowingCount = (userId: string) => {
  const { key, queryKey } = getFollowingCountKeys(userId);
  return useApiQuery(key, queryKey, () => getFollowingCount(userId));
};
