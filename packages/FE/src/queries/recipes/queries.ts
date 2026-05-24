import { Api } from "@/lib/api";
import type { Recipe } from "@/types/recipe";
import { DailyRecipe, RecipeList } from "@/types/recipe";

import { RecipeListQueryFilters } from "./types";

export type AdminRecipe = Recipe & {
  status: string;
  reviewedBy?: string;
  reviewedAt?: string;
};

export const getRecipes = ({ categoryId }: RecipeListQueryFilters) => {
  return new Api().get<RecipeList>("recipes", {
    params: {
      category: categoryId,
    },
  });
};
export const getRecipe = (id: string) => new Api().get<Recipe>(`recipes/${id}`);
export const getDailyRecipe = () => new Api().get<DailyRecipe>("recipes/daily");

export const getAdminRecipes = (status?: string) => {
  return new Api().get<AdminRecipe[]>("recipes/admin", {
    params: status ? { status } : undefined,
  });
};
