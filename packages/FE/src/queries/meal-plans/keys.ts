export const API_ACTION_BASE = "meal-plans";

export const getMealPlanByWeekKeys = (weekStart: string) => {
  const queryKey = [API_ACTION_BASE, "getByWeekStart", weekStart];
  const key = queryKey.join("/");
  return { key, queryKey };
};

export const getMealPlanKeys = (id: string) => {
  const baseQueryKey = [API_ACTION_BASE, "getMealPlan"];
  const key = baseQueryKey.join("/");
  const queryKey = [...baseQueryKey, id];
  return { key, queryKey };
};
