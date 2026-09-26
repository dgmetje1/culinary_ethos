import { useQueryClient, useMutation, type QueryKey } from "@tanstack/react-query";

import type { FollowStatus, FollowCount } from "./queries";

import { getIsFollowingKeys, getFollowersCountKeys, getFollowingCountKeys } from "./keys";
import { followUser, unfollowUser } from "./queries";

interface _FollowContext {
  statusKey: QueryKey;
  followersKey: QueryKey;
  followingKey: QueryKey;
  previousStatus: FollowStatus | undefined;
  previousFollowers: FollowCount | undefined;
  previousFollowing: FollowCount | undefined;
}

export const useFollowUser = (currentUserId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: followUser,
    onMutate: async (userId) => {
      const { queryKey: statusKey } = getIsFollowingKeys(userId);
      const { queryKey: followersKey } = getFollowersCountKeys(userId);
      const { queryKey: followingKey } = getFollowingCountKeys(currentUserId);

      await Promise.all([
        queryClient.cancelQueries({ queryKey: statusKey }),
        queryClient.cancelQueries({ queryKey: followersKey }),
        queryClient.cancelQueries({ queryKey: followingKey }),
      ]);

      const previousStatus = queryClient.getQueryData<FollowStatus>(statusKey);
      const previousFollowers = queryClient.getQueryData<FollowCount>(followersKey);
      const previousFollowing = queryClient.getQueryData<FollowCount>(followingKey);

      queryClient.setQueryData<FollowStatus>(statusKey, { following: true });
      queryClient.setQueryData<FollowCount>(followersKey, (old) => ({
        count: (old?.count ?? 0) + 1,
      }));
      queryClient.setQueryData<FollowCount>(followingKey, (old) => ({
        count: (old?.count ?? 0) + 1,
      }));

      return {
        statusKey,
        followersKey,
        followingKey,
        previousStatus,
        previousFollowers,
        previousFollowing,
      };
    },
    onError: (_err, _userId, context) => {
      if (context) {
        queryClient.setQueryData(context.statusKey, context.previousStatus);
        queryClient.setQueryData(context.followersKey, context.previousFollowers);
        queryClient.setQueryData(context.followingKey, context.previousFollowing);
      }
    },
    onSettled: (_data, _error, userId) => {
      const { queryKey: statusKey } = getIsFollowingKeys(userId);
      const { queryKey: followersKey } = getFollowersCountKeys(userId);
      const { queryKey: followingKey } = getFollowingCountKeys(currentUserId);
      queryClient.invalidateQueries({ queryKey: statusKey });
      queryClient.invalidateQueries({ queryKey: followersKey });
      queryClient.invalidateQueries({ queryKey: followingKey });
    },
  });
};

export const useUnfollowUser = (currentUserId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unfollowUser,
    onMutate: async (userId) => {
      const { queryKey: statusKey } = getIsFollowingKeys(userId);
      const { queryKey: followersKey } = getFollowersCountKeys(userId);
      const { queryKey: followingKey } = getFollowingCountKeys(currentUserId);

      await Promise.all([
        queryClient.cancelQueries({ queryKey: statusKey }),
        queryClient.cancelQueries({ queryKey: followersKey }),
        queryClient.cancelQueries({ queryKey: followingKey }),
      ]);

      const previousStatus = queryClient.getQueryData<FollowStatus>(statusKey);
      const previousFollowers = queryClient.getQueryData<FollowCount>(followersKey);
      const previousFollowing = queryClient.getQueryData<FollowCount>(followingKey);

      queryClient.setQueryData<FollowStatus>(statusKey, { following: false });
      queryClient.setQueryData<FollowCount>(followersKey, (old) => ({
        count: Math.max(0, (old?.count ?? 1) - 1),
      }));
      queryClient.setQueryData<FollowCount>(followingKey, (old) => ({
        count: Math.max(0, (old?.count ?? 1) - 1),
      }));

      return {
        statusKey,
        followersKey,
        followingKey,
        previousStatus,
        previousFollowers,
        previousFollowing,
      };
    },
    onError: (_err, _userId, context) => {
      if (context) {
        queryClient.setQueryData(context.statusKey, context.previousStatus);
        queryClient.setQueryData(context.followersKey, context.previousFollowers);
        queryClient.setQueryData(context.followingKey, context.previousFollowing);
      }
    },
    onSettled: (_data, _error, userId) => {
      const { queryKey: statusKey } = getIsFollowingKeys(userId);
      const { queryKey: followersKey } = getFollowersCountKeys(userId);
      const { queryKey: followingKey } = getFollowingCountKeys(currentUserId);
      queryClient.invalidateQueries({ queryKey: statusKey });
      queryClient.invalidateQueries({ queryKey: followersKey });
      queryClient.invalidateQueries({ queryKey: followingKey });
    },
  });
};
