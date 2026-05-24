import { UndefinedInitialDataOptions } from "@tanstack/react-query";

import { useApiQuery, useSuspenseApiQuery } from "@/middleware/api";
import { User } from "@/types/user";

import { getAccountKeys, getAllUsersKeys, getUserKeys, getUserSummaryKeys } from "./keys";
import { getUserOptions, getUserSummaryOptions } from "./options";
import { getAccount, getAllUsers } from "./queries";

export const useGetAllUsers = () => {
  const { key, queryKey } = getAllUsersKeys();

  return useApiQuery(key, queryKey, () => getAllUsers());
};

export const useGetAccount = (enabled?: UndefinedInitialDataOptions<User>["enabled"]) => {
  const { key, queryKey } = getAccountKeys();

  return useApiQuery(key, queryKey, () => getAccount(), {
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled,
  });
};

export const useSuspenseGetUser = () => {
  const { key } = getUserKeys();

  return useSuspenseApiQuery(key, getUserOptions());
};
export const useSuspenseGetUserSummary = (userId: User["id"]) => {
  const { key } = getUserSummaryKeys(userId);

  return useSuspenseApiQuery(key, getUserSummaryOptions(userId));
};
