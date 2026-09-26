import { Api } from "@/lib/api";
import { MealPlan } from "@/types/mealPlan";

export const getMealPlanByWeek = (weekStart: string) =>
  new Api().get<MealPlan | null>("meal-plans", {
    params: { weekStart },
  });

export const getMealPlan = (id: string) => new Api().get<MealPlan>(`meal-plans/${id}`);
