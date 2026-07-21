import { useQueryClient } from '@tanstack/react-query';

import { Api } from '@/lib/api';
import { useApiMutation } from '@/middleware/api';
import type { User } from '@/types/user';

import { getAllUsersKeys, getUserKeys } from './keys';

export type ProfileUpdateData = {
  nickName?: string;
  name?: string;
  lastName?: string;
  email?: string;
  language?: User['language'];
  profilePicture?: string;
};

export const useSuspendUser = () => {
  const queryClient = useQueryClient();

  return useApiMutation('', async (id: string) => {
    const api = new Api();
    return api.put(`users/${id}/suspend`, {});
  }, {
    onSuccess: () => {
      const { queryKey } = getAllUsersKeys();
      queryClient.invalidateQueries({ queryKey });
    },
  });
};

export const useActivateUser = () => {
  const queryClient = useQueryClient();

  return useApiMutation('', async (id: string) => {
    const api = new Api();
    return api.put(`users/${id}/activate`, {});
  }, {
    onSuccess: () => {
      const { queryKey } = getAllUsersKeys();
      queryClient.invalidateQueries({ queryKey });
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useApiMutation('', async ({ id, data }: { id: string; data: ProfileUpdateData }) => {
    const api = new Api();
    return api.put(`users/${id}`, {
      nick_name: data.nickName,
      name: data.name,
      last_name: data.lastName,
      email: data.email,
      language: data.language,
      profile_picture: data.profilePicture,
    });
  }, {
    onSuccess: () => {
      const { queryKey } = getUserKeys();
      queryClient.invalidateQueries({ queryKey });
    },
  });
};

export const useChangeUserRole = () => {
  const queryClient = useQueryClient();

  return useApiMutation('', async ({ id, role }: { id: string; role: string }) => {
    const api = new Api();
    return api.put(`users/${id}/role`, { role });
  }, {
    onSuccess: () => {
      const { queryKey } = getAllUsersKeys();
      queryClient.invalidateQueries({ queryKey });
    },
  });
};
