import { Api } from "@/lib/api";

export type SavedRecipeItem = {
  recipeId: string;
  savedAt: string;
};

export type SavedStatus = {
  saved: boolean;
};

export type SavedRecipeListItem = {
  id: string;
  title: string;
  categories: { id: string; name: string }[];
  time: number;
  author: string;
  thumbnailUrl: string | null;
  portions: number;
  savedAt: string;
};

export type SavedCount = {
  count: number;
};

export const getSavedRecipesData = () => {
  return new Api().get<SavedRecipeListItem[]>("saved-recipes/recipes", {
    withAuth: true,
  });
};

export const getSavedRecipeIds = () => {
  return new Api().get<SavedRecipeItem[]>("saved-recipes", {
    withAuth: true,
  });
};

export const getIsRecipeSaved = (recipeId: string) => {
  return new Api().get<SavedStatus>(`saved-recipes/${recipeId}/status`, {
    withAuth: true,
  });
};

export const getSavedRecipeCount = (recipeId: string) => {
  return new Api().get<SavedCount>(`saved-recipes/${recipeId}/count`, {
    withAuth: false,
  });
};

export const saveRecipe = (recipeId: string) => {
  return new Api().post<{ id: string }>(`saved-recipes/${recipeId}`, {});
};

export const unsaveRecipe = (recipeId: string) => {
  return new Api().delete(`saved-recipes/${recipeId}`, {});
};
