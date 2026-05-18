import { useApiQuery, useSuspenseApiQuery } from "@/middleware/api";

import { getCategoriesKeys } from "./keys";
import { getCategories } from "./queries";

export const useGetCategories = () => {
  const { key, queryKey } = getCategoriesKeys();

  return useApiQuery(key, queryKey, () => getCategories());
};

export const useSuspenseGetCategories = () => {
  const { key } = getCategoriesKeys();

  return useSuspenseApiQuery(key, {
    queryKey: [key],
    queryFn: () => getCategories(),
  });
};