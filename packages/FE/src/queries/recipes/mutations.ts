import { useQueryClient } from "@tanstack/react-query";

import { Api } from "@/lib/api";
import { useApiMutation } from "@/middleware/api";
import { CreateRecipeDTO } from "@/types/createRecipe";

import { getAdminRecipesKeys, getRecipesKeys, getRecipeKeys } from "./keys";

export const useCreateRecipe = () => {
  const queryClient = useQueryClient();
  const createRecipe: (data: CreateRecipeDTO) => Promise<string> = async (
    data: CreateRecipeDTO,
  ) => {
    const api = new Api();
    const response: string = await api.post("recipes", data);

    return response;
  };

  return useApiMutation("", createRecipe, {
    onSuccess: () => {
      const { queryKey } = getRecipesKeys({});
      queryClient.invalidateQueries({ queryKey });
    },
  });
};

export const useApproveRecipe = () => {
  const queryClient = useQueryClient();

  return useApiMutation(
    "",
    async (id: string) => {
      const api = new Api();
      return api.put(`recipes/${id}/approve`, {});
    },
    {
      onSuccess: () => {
        const { queryKey } = getAdminRecipesKeys();
        queryClient.invalidateQueries({ queryKey });
      },
    },
  );
};

export const useFlagRecipe = () => {
  const queryClient = useQueryClient();

  return useApiMutation(
    "",
    async (id: string) => {
      const api = new Api();
      return api.put(`recipes/${id}/flag`, {});
    },
    {
      onSuccess: () => {
        const { queryKey } = getAdminRecipesKeys();
        queryClient.invalidateQueries({ queryKey });
      },
    },
  );
};

export const useBanRecipe = () => {
  const queryClient = useQueryClient();

  return useApiMutation(
    "",
    async (id: string) => {
      const api = new Api();
      return api.put(`recipes/${id}/reject`, {});
    },
    {
      onSuccess: () => {
        const { queryKey } = getAdminRecipesKeys();
        queryClient.invalidateQueries({ queryKey });
      },
    },
  );
};

export const useDeleteRecipe = () => {
  const queryClient = useQueryClient();

  return useApiMutation(
    "",
    async (id: string) => {
      const api = new Api();
      return api.delete(`recipes/${id}`, {});
    },
    {
      onSuccess: () => {
        const { queryKey } = getAdminRecipesKeys();
        queryClient.invalidateQueries({ queryKey });
      },
    },
  );
};

export const useUpdateRecipe = () => {
  const queryClient = useQueryClient();
  const updateRecipe = async ({ id, data }: { id: string; data: CreateRecipeDTO }) => {
    const api = new Api();
    const response = await api.put(`recipes/${id}`, data);

    return response;
  };

  return useApiMutation("", updateRecipe, {
    onSuccess: (_, variables) => {
      const { queryKey } = getRecipeKeys(variables.id);
      queryClient.invalidateQueries({ queryKey });
    },
  });
};
