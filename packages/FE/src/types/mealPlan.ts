export type MealPlanEntry = {
  id: string;
  day: number;
  mealType: string;
  recipeId: string;
  recipeTitle: string;
  recipeImageUrl?: string;
  portions?: number;
};

export type MealPlan = {
  id: string;
  weekStart: string;
  entries: MealPlanEntry[];
  createdAt: string;
  updatedAt: string;
};

export type CreateMealPlanDTO = {
  weekStart: string;
  entries?: MealPlanEntry[];
};

export type UpdateMealPlanDTO = {
  entries: MealPlanEntry[];
};
