import { useApiQuery, useSuspenseApiQuery } from "@/middleware/api";

import {
  getAdminRecipesKeys,
  getDailyRecipeKeys,
  getRecipeKeys,
  getRecipesKeys,
  getUserPublicRecipesKeys,
  getUserRecipesKeys,
} from "./keys";
import { getRecipeOptions } from "./options";
import {
  getAdminRecipes,
  getDailyRecipe,
  getRecipe,
  getRecipes,
  getUserPublicRecipes,
  getUserRecipes,
} from "./queries";
import { RecipeListQueryFilters } from "./types";

export const useGetRecipes = (filters: RecipeListQueryFilters = {}) => {
  const { key, queryKey } = getRecipesKeys(filters);

  return useApiQuery(key, queryKey, () => getRecipes(filters));
};

export const useGetRecipe = (id: string) => {
  const { key, queryKey } = getRecipeKeys(id);

  return useApiQuery(key, queryKey, () => getRecipe(id));
};

export const useGetDailyRecipe = () => {
  const { key, queryKey } = getDailyRecipeKeys();

  return useApiQuery(key, queryKey, () => getDailyRecipe());
};

export const useSuspenseGetRecipe = (id: string) => {
  const queryOptions = getRecipeOptions(id);
  const { key } = getRecipeKeys(id);

  return useSuspenseApiQuery(key, queryOptions);
};

export const useGetUserRecipes = () => {
  const { key, queryKey } = getUserRecipesKeys();

  return useApiQuery(key, queryKey, () => getUserRecipes());
};

export const useGetUserPublicRecipes = (authorId: string) => {
  const { key, queryKey } = getUserPublicRecipesKeys(authorId);

  return useApiQuery(key, queryKey, () => getUserPublicRecipes(authorId));
};

export const useGetAdminRecipes = (status?: string) => {
  const { key, queryKey } = getAdminRecipesKeys(status);

  return useApiQuery(key, queryKey, () => getAdminRecipes(status));
};
