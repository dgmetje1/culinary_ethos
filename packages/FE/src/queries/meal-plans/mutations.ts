import { useQueryClient } from "@tanstack/react-query";

import { Api } from "@/lib/api";
import { useApiMutation } from "@/middleware/api";
import { CreateMealPlanDTO, UpdateMealPlanDTO, MealPlan } from "@/types/mealPlan";

import { getMealPlanByWeekKeys } from "./keys";

export const useCreateMealPlan = () => {
  const queryClient = useQueryClient();
  const createMealPlan = async (data: CreateMealPlanDTO) => {
    const api = new Api();
    const response: MealPlan = await api.post("meal-plans", data);
    return response;
  };

  return useApiMutation("", createMealPlan, {
    onSuccess: (plan) => {
      const { queryKey } = getMealPlanByWeekKeys(plan.weekStart);
      queryClient.invalidateQueries({ queryKey });
    },
  });
};

export const useUpdateMealPlan = () => {
  const queryClient = useQueryClient();
  const updateMealPlan = async ({
    id,
    data,
  }: {
    id: string;
    data: UpdateMealPlanDTO;
  }) => {
    const api = new Api();
    const response: MealPlan = await api.put(`meal-plans/${id}`, data);
    return response;
  };

  return useApiMutation("", updateMealPlan, {
    onSuccess: (plan) => {
      const { queryKey } = getMealPlanByWeekKeys(plan.weekStart);
      queryClient.invalidateQueries({ queryKey });
    },
  });
};

export const useDeleteMealPlan = () => {
  const queryClient = useQueryClient();
  const deleteMealPlan = async (id: string) => {
    const api = new Api();
    await api.delete(`meal-plans/${id}`, {});
  };

  return useApiMutation("", deleteMealPlan, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meal-plans"] });
    },
  });
};
