import { useQueryClient } from '@tanstack/react-query';

import { useApiMutation } from '@/middleware/api';

import { getIsRecipeSavedKeys, getSavedRecipeIdsKeys, getSavedRecipesDataKeys } from './keys';
import { saveRecipe, unsaveRecipe } from './queries';

export const useSaveRecipe = () => {
  const queryClient = useQueryClient();

  return useApiMutation('', saveRecipe, {
    onSuccess: (_, recipeId) => {
      const { queryKey: listKey } = getSavedRecipeIdsKeys();
      const { queryKey: dataKey } = getSavedRecipesDataKeys();
      const { queryKey: statusKey } = getIsRecipeSavedKeys(recipeId);
      queryClient.invalidateQueries({ queryKey: listKey });
      queryClient.invalidateQueries({ queryKey: dataKey });
      queryClient.invalidateQueries({ queryKey: statusKey });
    },
  });
};

export const useUnsaveRecipe = () => {
  const queryClient = useQueryClient();

  return useApiMutation('', unsaveRecipe, {
    onSuccess: (_, recipeId) => {
      const { queryKey: listKey } = getSavedRecipeIdsKeys();
      const { queryKey: dataKey } = getSavedRecipesDataKeys();
      const { queryKey: statusKey } = getIsRecipeSavedKeys(recipeId);
      queryClient.invalidateQueries({ queryKey: listKey });
      queryClient.invalidateQueries({ queryKey: dataKey });
      queryClient.invalidateQueries({ queryKey: statusKey });
    },
  });
};
