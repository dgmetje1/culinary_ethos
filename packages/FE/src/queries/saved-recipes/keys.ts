export const API_ACTION_BASE = "saved-recipes";

export const getSavedRecipesDataKeys = () => {
  const queryKey = [API_ACTION_BASE, "getSavedRecipesData"];
  const key = queryKey.join("/");
  return { key, queryKey };
};

export const getSavedRecipeIdsKeys = () => {
  const queryKey = [API_ACTION_BASE, "getSavedRecipeIds"];
  const key = queryKey.join("/");
  return { key, queryKey };
};

export const getIsRecipeSavedKeys = (recipeId: string) => {
  const queryKey = [API_ACTION_BASE, "isSaved", recipeId];
  const key = queryKey.join("/");
  return { key, queryKey };
};

export const getSavedRecipeCountKeys = (recipeId: string) => {
  const queryKey = [API_ACTION_BASE, "count", recipeId];
  const key = queryKey.join("/");
  return { key, queryKey };
};
