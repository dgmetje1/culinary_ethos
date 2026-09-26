import { useApiQuery, useSuspenseApiQuery } from "@/middleware/api";

import { getIngredientsKeys } from "./keys";
import { getIngredients } from "./queries";

export const useGetIngredients = () => {
  const { key, queryKey } = getIngredientsKeys();

  return useApiQuery(key, queryKey, () => getIngredients());
};

export const useSuspenseGetIngredients = () => {
  const { key } = getIngredientsKeys();

  return useSuspenseApiQuery(key, {
    queryKey: [key],
    queryFn: () => getIngredients(),
  });
};
