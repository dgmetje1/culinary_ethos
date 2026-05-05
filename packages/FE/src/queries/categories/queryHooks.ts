import { useSuspenseApiQuery } from "@/middleware/api";

import { getCategoriesKeys } from "./keys";
import { getCategoriesOptions } from "./options";

export const useSuspenseGetCategories = () => {
  const { key } = getCategoriesKeys();

  return useSuspenseApiQuery(key, getCategoriesOptions());
};
