export interface MealPlanEntry {
  id: string;
  day: number;
  mealType: string;
  recipeId: string;
  recipeTitle: string;
  recipeImageUrl?: string;
}

export interface MealPlanAttributes {
  id: string;
  weekStart: string;
  entries: MealPlanEntry[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMealPlanInput {
  weekStart: string;
  entries?: MealPlanEntry[];
}
