import { useQueryClient } from '@tanstack/react-query';

import { Api } from '@/lib/api';
import { useApiMutation } from '@/middleware/api';

import { getAllUsersKeys } from './keys';

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
