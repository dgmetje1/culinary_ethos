import { useApiQuery, UseApiQueryConfig } from '@/middleware/api';

import {
  getIsRecipeSavedKeys,
  getSavedRecipeCountKeys,
  getSavedRecipeIdsKeys,
  getSavedRecipesDataKeys,
} from './keys';
import {
  getIsRecipeSaved,
  getSavedRecipeCount,
  getSavedRecipeIds,
  getSavedRecipesData,
  SavedRecipeItem,
  SavedStatus,
} from './queries';

export const useGetSavedRecipeIds = (
  queryConfig?: Pick<UseApiQueryConfig<SavedRecipeItem[]>, 'enabled'>,
) => {
  const { key, queryKey } = getSavedRecipeIdsKeys();
  return useApiQuery(key, queryKey, () => getSavedRecipeIds(), queryConfig);
};

export const useGetIsRecipeSaved = (
  recipeId: string,
  queryConfig?: Pick<UseApiQueryConfig<SavedStatus>, 'enabled'>,
) => {
  const { key, queryKey } = getIsRecipeSavedKeys(recipeId);
  return useApiQuery(key, queryKey, () => getIsRecipeSaved(recipeId), queryConfig);
};

export const useGetSavedRecipeCount = (recipeId: string) => {
  const { key, queryKey } = getSavedRecipeCountKeys(recipeId);
  return useApiQuery(key, queryKey, () => getSavedRecipeCount(recipeId));
};

export const useGetSavedRecipesData = () => {
  const { key, queryKey } = getSavedRecipesDataKeys();
  return useApiQuery(key, queryKey, () => getSavedRecipesData());
};
