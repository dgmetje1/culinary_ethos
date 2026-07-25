import { Api } from '@/lib/api';

export type FollowStatus = {
  following: boolean;
};

export type FollowCount = {
  count: number;
};

export const getIsFollowing = (userId: string) => {
  return new Api().get<FollowStatus>(`follows/${userId}/status`, {
    withAuth: true,
  });
};

export const getFollowersCount = (userId: string) => {
  return new Api().get<FollowCount>(`follows/${userId}/followers`, {
    withAuth: false,
  });
};

export const getFollowingCount = (userId: string) => {
  return new Api().get<FollowCount>(`follows/${userId}/following`, {
    withAuth: false,
  });
};

export type FollowingItem = {
  followingId: string;
};

export type FollowerItem = {
  followerId: string;
};

export const getMyFollowing = () => {
  return new Api().get<FollowingItem[]>('follows/me/following', {
    withAuth: true,
  });
};

export const getMyFollowers = () => {
  return new Api().get<FollowerItem[]>('follows/me/followers', {
    withAuth: true,
  });
};

export const followUser = (userId: string) => {
  return new Api().post<{ id: string }>(`follows/${userId}`, {});
};

export const unfollowUser = (userId: string) => {
  return new Api().delete(`follows/${userId}`, {});
};
