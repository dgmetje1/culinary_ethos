import { useApiQuery } from '@/middleware/api';

import { getIsRecipeSavedKeys, getSavedRecipeCountKeys, getSavedRecipeIdsKeys, getSavedRecipesDataKeys } from './keys';
import { getIsRecipeSaved, getSavedRecipeCount, getSavedRecipeIds, getSavedRecipesData } from './queries';

export const useGetSavedRecipeIds = () => {
  const { key, queryKey } = getSavedRecipeIdsKeys();
  return useApiQuery(key, queryKey, () => getSavedRecipeIds());
};

export const useGetIsRecipeSaved = (recipeId: string) => {
  const { key, queryKey } = getIsRecipeSavedKeys(recipeId);
  return useApiQuery(key, queryKey, () => getIsRecipeSaved(recipeId));
};

export const useGetSavedRecipeCount = (recipeId: string) => {
  const { key, queryKey } = getSavedRecipeCountKeys(recipeId);
  return useApiQuery(key, queryKey, () => getSavedRecipeCount(recipeId));
};

export const useGetSavedRecipesData = () => {
  const { key, queryKey } = getSavedRecipesDataKeys();
  return useApiQuery(key, queryKey, () => getSavedRecipesData());
};
