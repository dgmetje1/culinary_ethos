import { useApiQuery, useSuspenseApiQuery } from "@/middleware/api";

import { getMealPlanByWeekKeys, getMealPlanKeys } from "./keys";
import { getMealPlanByWeekOptions } from "./options";
import { getMealPlanByWeek, getMealPlan } from "./queries";

export const useGetMealPlanByWeek = (weekStart: string) => {
  const { key, queryKey } = getMealPlanByWeekKeys(weekStart);
  return useApiQuery(key, queryKey, () => getMealPlanByWeek(weekStart));
};

export const useSuspenseGetMealPlanByWeek = (weekStart: string) => {
  const queryOptions = getMealPlanByWeekOptions(weekStart);
  const { key } = getMealPlanByWeekKeys(weekStart);
  return useSuspenseApiQuery(key, queryOptions);
};

export const useGetMealPlan = (id: string) => {
  const { key, queryKey } = getMealPlanKeys(id);
  return useApiQuery(key, queryKey, () => getMealPlan(id));
};
