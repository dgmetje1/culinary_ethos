import { useApiQuery, UseApiQueryConfig } from '@/middleware/api';

import {
  getIsFollowingKeys,
  getFollowersCountKeys,
  getFollowingCountKeys,
  getMyFollowingKeys,
  getMyFollowersKeys,
} from './keys';
import {
  getIsFollowing,
  getFollowersCount,
  getFollowingCount,
  getMyFollowing,
  getMyFollowers,
  FollowingItem,
} from './queries';

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

export const useGetMyFollowing = (
  queryConfig?: Pick<UseApiQueryConfig<FollowingItem[]>, 'enabled'>,
) => {
  const { key, queryKey } = getMyFollowingKeys();
  return useApiQuery(key, queryKey, () => getMyFollowing(), queryConfig);
};

export const useGetMyFollowers = () => {
  const { key, queryKey } = getMyFollowersKeys();
  return useApiQuery(key, queryKey, () => getMyFollowers());
};
