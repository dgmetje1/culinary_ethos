import { useApiQuery } from '@/middleware/api';

import { getIsFollowingKeys, getFollowersCountKeys, getFollowingCountKeys, getMyFollowingKeys, getMyFollowersKeys } from './keys';
import { getIsFollowing, getFollowersCount, getFollowingCount, getMyFollowing, getMyFollowers } from './queries';

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

export const useGetMyFollowing = () => {
  const { key, queryKey } = getMyFollowingKeys();
  return useApiQuery(key, queryKey, () => getMyFollowing());
};

export const useGetMyFollowers = () => {
  const { key, queryKey } = getMyFollowersKeys();
  return useApiQuery(key, queryKey, () => getMyFollowers());
};
