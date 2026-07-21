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
    withAuth: false,
    params: {
      category: categoryId,
    },
  });
};
export const getRecipe = (id: string) =>
  new Api().get<Recipe>(`recipes/${id}`, { withAuth: false });
export const getDailyRecipe = () =>
  new Api().get<DailyRecipe>("recipes/daily", { withAuth: false });

export const getUserRecipes = () => {
  return new Api().get<RecipeList>("recipes/user", { withAuth: true });
};

export const getUserPublicRecipes = (authorId: string) => {
  return new Api().get<RecipeList>(`recipes/author/${authorId}`, { withAuth: false });
};

export const getAdminRecipes = (status?: string) => {
  return new Api().get<AdminRecipe[]>("recipes/admin", {
    params: status ? { status } : undefined,
  });
};
