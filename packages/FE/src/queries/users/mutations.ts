import { useQueryClient } from "@tanstack/react-query";

import { Api } from "@/lib/api";
import { useApiMutation } from "@/middleware/api";
import type { User } from "@/types/user";

import { getAccountKeys, getAllUsersKeys, getUserKeys } from "./keys";

export type ProfileUpdateData = {
  nickName?: string;
  name?: string;
  lastName?: string;
  email?: string;
  language?: User["language"];
  profilePicture?: string;
  description?: string;
  position?: string;
  location?: string;
};

export const useSuspendUser = () => {
  const queryClient = useQueryClient();

  return useApiMutation(
    "",
    async (id: string) => {
      const api = new Api();
      return api.put(`users/${id}/suspend`, {});
    },
    {
      onSuccess: () => {
        const { queryKey } = getAllUsersKeys();
        queryClient.invalidateQueries({ queryKey });
      },
    },
  );
};

export const useActivateUser = () => {
  const queryClient = useQueryClient();

  return useApiMutation(
    "",
    async (id: string) => {
      const api = new Api();
      return api.put(`users/${id}/activate`, {});
    },
    {
      onSuccess: () => {
        const { queryKey } = getAllUsersKeys();
        queryClient.invalidateQueries({ queryKey });
      },
    },
  );
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useApiMutation(
    "",
    async ({ id, data }: { id: string; data: ProfileUpdateData }) => {
      const api = new Api();
      return api.put(`users/${id}`, {
        nick_name: data.nickName,
        name: data.name,
        last_name: data.lastName,
        email: data.email,
        language: data.language,
        profile_picture: data.profilePicture,
        description: data.description,
        position: data.position,
        location: data.location,
      });
    },
    {
      onSuccess: () => {
        const { queryKey: userKey } = getUserKeys();
        const { queryKey: accountKey } = getAccountKeys();
        queryClient.invalidateQueries({ queryKey: userKey });
        queryClient.invalidateQueries({ queryKey: accountKey });
      },
    },
  );
};

export const useChangeUserRole = () => {
  const queryClient = useQueryClient();

  return useApiMutation(
    "",
    async ({ id, role }: { id: string; role: string }) => {
      const api = new Api();
      return api.put(`users/${id}/role`, { role });
    },
    {
      onSuccess: () => {
        const { queryKey } = getAllUsersKeys();
        queryClient.invalidateQueries({ queryKey });
      },
    },
  );
};
