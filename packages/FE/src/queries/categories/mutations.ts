import { useQueryClient } from "@tanstack/react-query";

import { Api } from "@/lib/api";
import { useApiMutation } from "@/middleware/api";
import { Category, CategoryCreateDTO, CategoryEditDTO } from "@/types/category";

import { getCategoriesKeys } from "./keys";

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const createCategory = async (data: CategoryCreateDTO) => {
    const api = new Api();
    const response = await api.post("categories", data);

    return response;
  };

  return useApiMutation("", createCategory, {
    onSuccess: () => {
      const { queryKey } = getCategoriesKeys();
      queryClient.invalidateQueries({ queryKey });
    },
  });
};

export const useEditCategory = () => {
  const queryClient = useQueryClient();
  const editCategory = async (data: CategoryEditDTO) => {
    const api = new Api();
    const response = await api.put("categories", data);

    return response;
  };

  return useApiMutation("", editCategory, {
    onSuccess: () => {
      const { queryKey } = getCategoriesKeys();
      queryClient.invalidateQueries({ queryKey });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const deleteCategory = async (id: Category["id"]) => {
    const api = new Api();
    const response = await api.delete(`categories/${id}`, null);

    return response;
  };

  return useApiMutation("", deleteCategory, {
    onSuccess: () => {
      const { queryKey } = getCategoriesKeys();
      queryClient.invalidateQueries({ queryKey });
    },
  });
};
