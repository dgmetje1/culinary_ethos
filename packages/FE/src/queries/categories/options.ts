import { queryOptions } from "@tanstack/react-query";

import { getCategoriesKeys } from "./keys";
import { getCategories } from "./queries";

export const getCategoriesOptions = () => {
  const { queryKey } = getCategoriesKeys();
  return queryOptions({
    queryKey,
    queryFn: () => getCategories(),
  });
};
